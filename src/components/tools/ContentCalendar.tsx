"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { holidaysBetween, type Holiday } from "@/lib/holidays";
import { Parisienne } from "next/font/google";

// The month's name, in an elegant script like a printed calendar
const script = Parisienne({ subsets: ["latin"], weight: "400" });

// ✏️ Options people can choose for each post
const PLATFORMS = [
  { name: "Instagram", color: "#c79f9b" },
  { name: "TikTok", color: "#4a2f27" },
  { name: "Facebook", color: "#46608a" },
  { name: "Pinterest", color: "#b3261e" },
  { name: "LinkedIn", color: "#8ea7bf" },
  { name: "YouTube", color: "#d9a62e" },
];
const FORMATS = ["Post", "Reel", "Carousel", "Story", "Video", "Live", "Pin"];
const STATUSES = [
  { value: "idea", label: "Idea" },
  { value: "draft", label: "Drafted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "posted", label: "Posted" },
] as const;
type Status = (typeof STATUSES)[number]["value"];

type Post = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string | null;
  platform: string;
  format: string;
  title: string;
  caption: string | null;
  status: Status;
};

type Draft = Omit<Post, "id"> & { id?: string; holiday?: Holiday };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const arrowBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-3xl leading-none text-cocoa/70 transition hover:bg-cocoa/10 hover:text-cocoa";
const label = "block text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";
const input =
  "mt-2 w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const btn =
  "border border-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40 disabled:opacity-40";
const btnDark =
  "bg-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-40";

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// All days shown for a month, Monday to Sunday, including the edges of
// the previous and next months
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  // Drop a last row that belongs entirely to the next month
  return days[35].getMonth() !== month ? days.slice(0, 35) : days;
}

// The 7 days of the week that contains this date, Monday first
function weekDays(anchor: Date) {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - ((anchor.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

type View = "month" | "week";
const VIEW_KEY = "sb_calendar_view";
const HOLIDAYS_KEY = "sb_calendar_holidays";

function platformColor(name: string) {
  return PLATFORMS.find((p) => p.name === name)?.color ?? "#8ea7bf";
}

export default function ContentCalendar() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(today); // any day in the month or week shown
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string[]>([]); // empty = all platforms
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [showHolidays, setShowHolidays] = useState(true);

  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const days = useMemo(
    () => (view === "week" ? weekDays(anchor) : monthGrid(anchor.getFullYear(), anchor.getMonth())),
    [view, anchor],
  );
  const rangeStart = ymd(days[0]);
  const rangeEnd = ymd(days[days.length - 1]);

  const load = useCallback(async () => {
    const { data, error } = await createClient()
      .from("content_calendar_posts")
      .select("id, date, time, platform, format, title, caption, status")
      .gte("date", rangeStart)
      .lte("date", rangeEnd)
      .order("date")
      .order("time", { nullsFirst: true });
    if (error) {
      setError("Your calendar couldn't load. Please refresh the page.");
      console.error(error);
    } else {
      setError(null);
      setPosts((data as Post[]) ?? []);
    }
    setLoading(false);
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Remember Month or Week for next time (this device only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "week" || saved === "month") setView(saved);
      if (localStorage.getItem(HOLIDAYS_KEY) === "off") setShowHolidays(false);
    } catch {}
  }, []);

  function toggleHolidays() {
    setShowHolidays((on) => {
      try {
        localStorage.setItem(HOLIDAYS_KEY, on ? "off" : "on");
      } catch {}
      return !on;
    });
  }

  // Social media holidays for the days on screen
  const holidaysByDay = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    if (!showHolidays) return map;
    for (const h of holidaysBetween(rangeStart, rangeEnd)) map.set(h.date, [...(map.get(h.date) ?? []), h]);
    return map;
  }, [showHolidays, rangeStart, rangeEnd]);

  function planHoliday(h: Holiday) {
    setEditing({
      date: h.date,
      time: null,
      platform: filter.length === 1 ? filter[0] : "Instagram",
      format: "Post",
      title: h.name,
      caption: h.idea,
      status: "idea",
      holiday: h,
    });
  }

  function changeView(v: View) {
    setView(v);
    setLoading(true);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  }

  const visible = posts.filter((p) => filter.length === 0 || filter.includes(p.platform));
  const byDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of visible) map.set(p.date, [...(map.get(p.date) ?? []), p]);
    return map;
  }, [visible]);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  // Posts in the month or week being shown
  const monthPosts =
    view === "week"
      ? visible.filter((p) => p.date >= rangeStart && p.date <= rangeEnd)
      : visible.filter((p) => p.date.startsWith(monthKey));

  function shift(delta: number) {
    setAnchor(
      view === "week"
        ? new Date(year, month, anchor.getDate() + 7 * delta)
        : new Date(year, month + delta, 1),
    );
    setLoading(true);
  }

  function newPost(date: string) {
    setEditing({
      date,
      time: null,
      platform: filter.length === 1 ? filter[0] : "Instagram",
      format: "Post",
      title: "",
      caption: "",
      status: "idea",
    });
  }

  async function save(draft: Draft) {
    if (!draft.title.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const row = {
      date: draft.date,
      time: draft.time || null,
      platform: draft.platform,
      format: draft.format,
      title: draft.title.trim(),
      caption: draft.caption?.trim() || null,
      status: draft.status,
      updated_at: new Date().toISOString(),
    };
    const { error } = draft.id
      ? await supabase.from("content_calendar_posts").update(row).eq("id", draft.id)
      : await supabase.from("content_calendar_posts").insert(row);
    setSaving(false);
    if (error) {
      setError("That post couldn't be saved. Please try again.");
      console.error(error);
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post from your calendar?")) return;
    const { error } = await createClient().from("content_calendar_posts").delete().eq("id", id);
    if (error) setError("That post couldn't be deleted.");
    setEditing(null);
    load();
  }

  async function moveTo(id: string, date: string) {
    const post = posts.find((p) => p.id === id);
    if (!post || post.date === date) return;
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, date } : p)));
    const { error } = await createClient()
      .from("content_calendar_posts")
      .update({ date, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setError("That post couldn't be moved.");
      load();
    }
  }

  function exportCsv() {
    const esc = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Date", "Time", "Platform", "Format", "Title", "Caption", "Status"],
      ...monthPosts.map((p) => [
        p.date,
        p.time ?? "",
        p.platform,
        p.format,
        p.title,
        p.caption ?? "",
        STATUSES.find((s) => s.value === p.status)?.label ?? p.status,
      ]),
    ];
    const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `content-calendar-${view === "week" ? `week-${rangeStart}` : monthKey}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const todayKey = ymd(today);
  const counts = STATUSES.map((s) => ({
    ...s,
    n: monthPosts.filter((p) => p.status === s.value).length,
  }));

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex border border-cocoa/30">
            {(["month", "week"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => changeView(v)}
                className={`px-3 py-2 text-[0.6rem] uppercase tracking-[0.25em] transition ${
                  view === v ? "bg-cocoa text-periwinkle" : "text-cocoa hover:bg-rose/30"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={btn}
            onClick={() => {
              setAnchor(today);
              setLoading(true);
            }}
          >
            Today
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={exportCsv} disabled={monthPosts.length === 0}>
            Export CSV
          </button>
          <button type="button" className={btnDark} onClick={() => newPost(todayKey)}>
            + Add post
          </button>
        </div>
      </div>

      {/* Platform filter + month summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-cocoa/20 bg-paper px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/60">Show</span>
          {PLATFORMS.map((p) => {
            const on = filter.includes(p.name);
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  setFilter((f) => (on ? f.filter((x) => x !== p.name) : [...f, p.name]))
                }
                className={`flex items-center gap-2 px-3 py-1 font-serif text-base transition ${
                  on ? "bg-cocoa text-cream" : "border border-cocoa/25 text-ink hover:bg-rose/25"
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                {p.name}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={showHolidays}
            onClick={toggleHolidays}
            className={`flex items-center gap-2 px-3 py-1 font-serif text-base transition ${
              showHolidays ? "bg-[#f9e9a8] text-ink" : "border border-cocoa/25 text-ink/60 hover:bg-rose/25"
            }`}
          >
            🎉 Holidays
          </button>
          {filter.length > 0 && (
            <button type="button" onClick={() => setFilter([])} className="font-serif text-base text-denim underline">
              Show all
            </button>
          )}
        </div>
        <p className="font-serif text-base text-cocoa/70">
          {monthPosts.length} post{monthPosts.length === 1 ? "" : "s"} this {view}
          {monthPosts.length > 0 &&
            " · " + counts.filter((c) => c.n).map((c) => `${c.n} ${c.label.toLowerCase()}`).join(" · ")}
        </p>
      </div>

      {error && <p className="font-serif text-lg text-red-800">{error}</p>}

      {/* The calendar itself: lace-edged paper on dark brown */}
      <div className="-mx-4 rounded-[12px] bg-cocoa-deep px-1.5 py-4 sm:mx-0 sm:p-6 md:p-10">
      <LacePaper>
        <div className="px-2 pb-2 pt-3 text-center sm:px-6 md:pt-6">
          <div className="flex items-center justify-center gap-1 sm:gap-6">
            <button type="button" aria-label={`Previous ${view}`} onClick={() => shift(-1)} className={arrowBtn}>
              ‹
            </button>
            <h2
              className={`min-w-0 leading-none text-cocoa-deep ${script.className} ${
                view === "week" ? "text-3xl sm:text-6xl md:text-7xl" : "text-[2.6rem] sm:text-7xl md:text-[7rem]"
              }`}
            >
              {view === "week" ? weekTitle(days[0], days[6]) : new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long" })}
            </h2>
            <button type="button" aria-label={`Next ${view}`} onClick={() => shift(1)} className={arrowBtn}>
              ›
            </button>
          </div>
          <p className="mt-2 text-xs tracking-[0.12em] text-cocoa-deep sm:mt-3 sm:text-base">
            {view === "week" ? "WEEKLY PLAN" : `${year} CALENDAR`}
          </p>
        </div>
        <div className="px-1 pb-2 pt-5 sm:px-4 md:pt-8">

      {view === "month" ? (
        <>
      {/* Month grid (tablets and up) */}
      <div className={`hidden md:block ${loading ? "opacity-60" : ""}`}>
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((d) => (
            <div key={d} className="pb-2.5 pl-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cocoa-deep">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-l border-t border-cocoa/35">
          {days.map((d) => {
            const key = ymd(d);
            const inMonth = d.getMonth() === month;
            const dayPosts = byDay.get(key) ?? [];
            return (
              <div
                key={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) moveTo(dragId, key);
                  setDragId(null);
                }}
                className="group relative min-h-[120px] border-b border-r border-cocoa/35 p-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center font-sans text-xs font-semibold ${
                      key === todayKey ? "rounded-full bg-cocoa text-cream" : inMonth ? "text-cocoa-deep" : "text-cocoa/30"
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add a post on ${key}`}
                    onClick={() => newPost(key)}
                    className="h-6 w-6 text-lg leading-none text-cocoa/50 opacity-0 transition hover:text-denim focus:opacity-100 group-hover:opacity-100"
                  >
                    +
                  </button>
                </div>
                <div className="mt-1 space-y-1">
                  {(holidaysByDay.get(key) ?? []).map((h) => (
                    <HolidayTag key={h.name} holiday={h} onPlan={() => planHoliday(h)} />
                  ))}
                  {dayPosts.map((p) => (
                    <PostChip key={p.id} post={p} onOpen={() => setEditing(p)} onDragStart={() => setDragId(p.id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center font-serif text-sm text-cocoa/55">
          Tip: drag a post to another day to move it.
        </p>
      </div>

      {/* Agenda list (phones) */}
      <div className={`space-y-3 md:hidden ${loading ? "opacity-60" : ""}`}>
        {days
          .filter((d) => d.getMonth() === month)
          .map((d) => {
            const key = ymd(d);
            const dayPosts = byDay.get(key) ?? [];
            const dayHolidays = holidaysByDay.get(key) ?? [];
            if (dayPosts.length === 0 && dayHolidays.length === 0 && key !== todayKey) return null;
            return (
              <div key={key} className="border border-cocoa/30 bg-white/35 p-3">
                <div className="flex items-center justify-between">
                  <p className={`font-serif text-lg ${key === todayKey ? "font-semibold text-cocoa" : "text-ink"}`}>
                    {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                    {key === todayKey && " · Today"}
                  </p>
                  <button type="button" onClick={() => newPost(key)} className="text-xl text-cocoa/60" aria-label={`Add a post on ${key}`}>
                    +
                  </button>
                </div>
                <div className="mt-2 space-y-1.5">
                  {dayHolidays.map((h) => (
                    <HolidayTag key={h.name} holiday={h} onPlan={() => planHoliday(h)} />
                  ))}
                  {dayPosts.map((p) => (
                    <PostChip key={p.id} post={p} onOpen={() => setEditing(p)} />
                  ))}
                </div>
              </div>
            );
          })}
        {!loading && monthPosts.length === 0 && (
          <p className="py-6 text-center font-serif text-lg text-cocoa/70">
            Nothing planned this month yet. Tap “+ Add post” to start.
          </p>
        )}
      </div>
        </>
      ) : (
        <>
      {/* Week view (tablets and up) */}
      <div className={`hidden md:block ${loading ? "opacity-60" : ""}`}>
        <div className="grid grid-cols-7 border-l border-t border-cocoa/35">
          {days.map((d) => {
            const key = ymd(d);
            const dayPosts = byDay.get(key) ?? [];
            const isToday = key === todayKey;
            return (
              <div
                key={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) moveTo(dragId, key);
                  setDragId(null);
                }}
                className="flex min-h-[440px] flex-col border-b border-r border-cocoa/35"
              >
                <div className={`border-b border-cocoa/35 px-2 py-2 text-center ${isToday ? "bg-cocoa text-cream" : "text-cocoa-deep"}`}>
                  <p className={`text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${isToday ? "text-cream/80" : ""}`}>
                    {WEEKDAYS[(d.getDay() + 6) % 7]}
                  </p>
                  <p className="font-sans text-xl font-semibold leading-tight">{d.getDate()}</p>
                </div>
                <div className="flex-1 space-y-2 p-1.5">
                  {(holidaysByDay.get(key) ?? []).map((h) => (
                    <HolidayTag key={h.name} holiday={h} onPlan={() => planHoliday(h)} />
                  ))}
                  {dayPosts.map((p) => (
                    <WeekCard key={p.id} post={p} onOpen={() => setEditing(p)} onDragStart={() => setDragId(p.id)} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => newPost(key)}
                  aria-label={`Add a post on ${key}`}
                  className="m-1.5 border border-dashed border-cocoa/30 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60 transition hover:border-denim hover:text-denim"
                >
                  + Add
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center font-serif text-sm text-cocoa/55">
          Tip: drag a post to another day to move it.
        </p>
      </div>

      {/* Week list (phones): every day, even empty ones */}
      <div className={`space-y-3 md:hidden ${loading ? "opacity-60" : ""}`}>
        {days.map((d) => {
          const key = ymd(d);
          const dayPosts = byDay.get(key) ?? [];
          return (
            <div key={key} className="border border-cocoa/30 bg-white/35 p-3">
              <div className="flex items-center justify-between">
                <p className={`font-serif text-lg ${key === todayKey ? "font-semibold text-cocoa" : "text-ink"}`}>
                  {d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                  {key === todayKey && " · Today"}
                </p>
                <button type="button" onClick={() => newPost(key)} className="text-xl text-cocoa/60" aria-label={`Add a post on ${key}`}>
                  +
                </button>
              </div>
              {(holidaysByDay.get(key) ?? []).length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {(holidaysByDay.get(key) ?? []).map((h) => (
                    <HolidayTag key={h.name} holiday={h} onPlan={() => planHoliday(h)} />
                  ))}
                </div>
              )}
              {dayPosts.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {dayPosts.map((p) => (
                    <WeekCard key={p.id} post={p} onOpen={() => setEditing(p)} />
                  ))}
                </div>
              ) : (holidaysByDay.get(key) ?? []).length > 0 ? null : (
                <p className="mt-1 font-serif text-base text-cocoa/40">Nothing planned</p>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}

        </div>
        <p className="px-2 pb-3 pt-4 text-center text-[0.6rem] tracking-[0.1em] text-cocoa-deep sm:pb-5 sm:pt-6 sm:text-sm">
          {new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long" }).toUpperCase()}, LET&apos;S MAKE IT A GOOD ONE.
        </p>
      </LacePaper>
      </div>

      {editing && (
        <PostEditor
          draft={editing}
          saving={saving}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
          onDelete={editing.id ? () => remove(editing.id!) : undefined}
          onDuplicate={
            editing.id
              ? () => setEditing({ ...editing, id: undefined, title: `${editing.title} (copy)`, status: "idea" })
              : undefined
          }
        />
      )}
    </div>
  );
}

// A social media holiday; clicking it starts a post for that day
function HolidayTag({ holiday, onPlan }: { holiday: Holiday; onPlan: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlan}
      title={`${holiday.name}: ${holiday.idea} Click to plan a post.`}
      className="flex w-full items-center gap-1 bg-[#f9e9a8]/80 px-1.5 py-0.5 text-left font-serif text-xs leading-tight text-ink transition hover:bg-[#f9e9a8]"
    >
      <span aria-hidden="true">🎉</span>
      <span className="truncate">{holiday.name}</span>
    </button>
  );
}

function weekTitle(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth();
  const s = start.toLocaleDateString("en-GB", sameMonth ? { day: "numeric" } : { day: "numeric", month: "short" });
  const e = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${s} – ${e}`;
}

// A bigger card for the week view, with the caption preview
function WeekCard({
  post,
  onOpen,
  onDragStart,
}: {
  post: Post;
  onOpen: () => void;
  onDragStart?: () => void;
}) {
  const color = platformColor(post.platform);
  const done = post.status === "posted";
  const status = STATUSES.find((s) => s.value === post.status)?.label;
  return (
    <button
      type="button"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onOpen}
      title={`${post.platform} · ${post.format} · ${post.title}`}
      className={`block w-full border-t-4 bg-paper p-2 text-left shadow-sm transition hover:bg-rose/20 ${done ? "opacity-60" : ""}`}
      style={{ borderColor: color }}
    >
      <span className="flex items-center justify-between gap-1 text-[0.55rem] uppercase tracking-[0.15em] text-cocoa/70">
        <span className="truncate">{post.platform}</span>
        {post.time && <span className="shrink-0 font-sans">{post.time}</span>}
      </span>
      <span className={`mt-1 block font-serif text-base leading-snug text-ink ${done ? "line-through" : ""}`}>
        {post.title}
      </span>
      {post.caption && (
        <span className="mt-1 line-clamp-2 font-serif text-sm leading-snug text-ink/60">{post.caption}</span>
      )}
      <span className="mt-2 flex flex-wrap gap-1">
        <span className="bg-cream px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.15em] text-cocoa">{post.format}</span>
        <span
          className={`px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.15em] ${
            post.status === "scheduled" ? "bg-denim text-cream" : post.status === "draft" ? "bg-rose text-cocoa" : "bg-cream text-cocoa/70"
          }`}
        >
          {status}
        </span>
      </span>
    </button>
  );
}

function PostChip({
  post,
  onOpen,
  onDragStart,
}: {
  post: Post;
  onOpen: () => void;
  onDragStart?: () => void;
}) {
  const color = platformColor(post.platform);
  const done = post.status === "posted";
  return (
    <button
      type="button"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onOpen}
      title={`${post.platform} · ${post.format} · ${post.title}`}
      className={`flex w-full items-start gap-1.5 border-l-4 bg-paper px-1.5 py-1 text-left shadow-sm transition hover:bg-rose/20 ${
        done ? "opacity-60" : ""
      }`}
      style={{ borderColor: color }}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[0.55rem] uppercase tracking-[0.15em] text-cocoa/60">
          {post.time ? `${post.time} · ` : ""}
          {post.format}
          {post.status !== "idea" && ` · ${STATUSES.find((s) => s.value === post.status)?.label}`}
        </span>
        <span className={`block truncate font-serif text-sm leading-tight text-ink ${done ? "line-through" : ""}`}>
          {post.title}
        </span>
      </span>
    </button>
  );
}

function PostEditor({
  draft,
  saving,
  onChange,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
}: {
  draft: Draft;
  saving: boolean;
  onChange: (d: Draft) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={draft.id ? "Edit post" : "Add post"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto border border-cocoa/25 bg-paper p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-script text-4xl text-denim">{draft.id ? "Edit post" : "New post"}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl text-cocoa/60 hover:text-cocoa">
            ×
          </button>
        </div>

        {draft.holiday && !draft.id && (
          <div className="mt-3 bg-[#f9e9a8]/60 p-3 font-serif text-base text-ink">
            <p>
              <span aria-hidden="true">🎉 </span>
              <strong className="font-semibold">{draft.holiday.name}</strong>: {draft.holiday.idea}
            </p>
            <p className="mt-1 text-sm">
              Find matching content:{" "}
              <Link href={`/videos?q=${encodeURIComponent(draft.holiday.search)}`} className="text-denim underline">
                videos
              </Link>
              {" · "}
              <Link href={`/templates?q=${encodeURIComponent(draft.holiday.search)}`} className="text-denim underline">
                templates
              </Link>
              {" · "}
              <Link href={`/images?q=${encodeURIComponent(draft.holiday.search)}`} className="text-denim underline">
                images
              </Link>
            </p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <label className={label}>
            What&apos;s the post about? *
            <input
              autoFocus
              required
              maxLength={200}
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Autumn latte launch reel"
              className={input}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={label}>
              Date
              <input type="date" required value={draft.date} onChange={(e) => set("date", e.target.value)} className={input} />
            </label>
            <label className={label}>
              Time
              <input type="time" value={draft.time ?? ""} onChange={(e) => set("time", e.target.value || null)} className={input} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={label}>
              Platform
              <select value={draft.platform} onChange={(e) => set("platform", e.target.value)} className={input}>
                {PLATFORMS.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              Format
              <select value={draft.format} onChange={(e) => set("format", e.target.value)} className={input}>
                {FORMATS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset>
            <legend className={label}>Status</legend>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={draft.status === s.value}
                  onClick={() => set("status", s.value)}
                  className={`py-2 text-[0.6rem] uppercase tracking-[0.15em] transition ${
                    draft.status === s.value ? "bg-denim text-cream" : "border border-cocoa/25 text-cocoa hover:bg-rose/25"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className={label}>
            Caption & notes
            <textarea
              rows={5}
              maxLength={5000}
              value={draft.caption ?? ""}
              onChange={(e) => set("caption", e.target.value)}
              placeholder="Hook, caption, hashtags, ideas for the visual…"
              className={input}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button type="submit" disabled={saving || !draft.title.trim()} className={`${btnDark} flex-1 py-3`}>
            {saving ? "Saving…" : "Save"}
          </button>
          {onDuplicate && (
            <button type="button" onClick={onDuplicate} className={`${btn} py-3`}>
              Duplicate
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} className="px-3 py-3 text-[0.65rem] uppercase tracking-[0.25em] text-red-800 hover:underline">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Lace-edged paper (pieces of a real photo, see .lace in globals.css)
function LacePaper({ children }: { children: React.ReactNode }) {
  return (
    <div className="lace">
      {["fill", "tl", "tr", "bl", "br", "top", "bottom", "left", "right"].map((p) => (
        <span key={p} aria-hidden="true" className={`lace-piece lace-${p}`} />
      ))}
      {children}
    </div>
  );
}
