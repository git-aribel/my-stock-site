"use client";

import { useCallback, useEffect, useState } from "react";
import { Caveat, Parisienne } from "next/font/google";
import { createClient } from "@/lib/supabase/client";
import { CHECKLIST_TEMPLATES, type ChecklistTemplate, type Resets } from "@/lib/checklists";

type Item = { id: string; text: string; done: boolean };
type List = {
  id: string;
  title: string;
  emoji: string | null;
  template: string | null;
  resets: Resets;
  items: Item[];
  last_reset: string | null;
};

const EMOJIS = ["📝", "✨", "📸", "🎬", "💬", "🗓️", "🚀", "💡", "🛍️", "💌", "☕", "🌸"];
const RESETS: { value: Resets; label: string }[] = [
  { value: "never", label: "Never" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
];

const label = "block text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";
const input =
  "mt-2 w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const btn =
  "border border-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40 disabled:opacity-40";
const btnDark =
  "bg-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-40";

// Grows a text box to fit its text, so long tasks and titles wrap
function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

const MAX_TASK = 500;

// Finds web links in a task (https://…, http://… or www.…)
const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;:!?)\]]/gi;
function findLinks(text: string) {
  const links: { href: string; label: string }[] = [];
  for (const raw of text.match(URL_RE) ?? []) {
    try {
      const url = new URL(raw.startsWith("www.") ? `https://${raw}` : raw);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      if (links.some((l) => l.href === url.href)) continue;
      links.push({ href: url.href, label: url.hostname.replace(/^www\./, "") });
    } catch {}
  }
  return links.slice(0, 5);
}

// Handwriting for the notebook page
const hand = Caveat({ subsets: ["latin"], weight: ["400", "500", "600"] });
// The list's title, in the same elegant script as the welcome letter
const titleHand = Parisienne({ subsets: ["latin"], weight: "400" });

const newId = () => crypto.randomUUID();

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// The day a repeating list last started over: today, or this week's Monday
function periodStart(resets: Resets) {
  const d = new Date();
  if (resets === "weekly") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return ymd(d);
}

const resetNote = (r: Resets) =>
  r === "daily" ? "Unticks every morning" : r === "weekly" ? "Unticks every Monday" : "";

export default function Checklists() {
  const [lists, setLists] = useState<List[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const save = useCallback(async (id: string, patch: Partial<Omit<List, "id">>) => {
    const { error } = await createClient()
      .from("checklists")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      console.error(error);
      setError("That change couldn't be saved. Please try again.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await createClient()
        .from("checklists")
        .select("id, title, emoji, template, resets, items, last_reset")
        .order("created_at");
      if (error) {
        console.error(error);
        setError("Your lists couldn't load. Please refresh the page.");
        setLoading(false);
        return;
      }
      // Daily and weekly lists start fresh when a new day or week begins
      const loaded = ((data as List[]) ?? []).map((l) => {
        if (l.resets === "never") return l;
        const start = periodStart(l.resets);
        if (l.last_reset && l.last_reset >= start) return l;
        const fresh = { ...l, items: l.items.map((i) => ({ ...i, done: false })), last_reset: start };
        save(l.id, { items: fresh.items, last_reset: start });
        return fresh;
      });
      setLists(loaded);
      setSelected(loaded[0]?.id ?? null);
      setLoading(false);
    })();
  }, [save]);

  function change(id: string, patch: Partial<Omit<List, "id">>, persist = true) {
    setLists((all) => all.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    if (persist) save(id, patch);
  }

  async function create(draft: { title: string; emoji: string; template: string | null; resets: Resets; items: string[] }) {
    const row = {
      title: draft.title.trim().slice(0, 80),
      emoji: draft.emoji,
      template: draft.template,
      resets: draft.resets,
      items: draft.items.map((text) => ({ id: newId(), text, done: false })),
      last_reset: draft.resets === "never" ? null : periodStart(draft.resets),
    };
    const { data, error } = await createClient()
      .from("checklists")
      .insert(row)
      .select("id, title, emoji, template, resets, items, last_reset")
      .single();
    if (error || !data) {
      console.error(error);
      setError("Your list couldn't be created. Please try again.");
      return;
    }
    setError(null);
    setLists((all) => [...all, data as List]);
    setSelected((data as List).id);
    setCreating(false);
  }

  async function remove(id: string) {
    const list = lists.find((l) => l.id === id);
    if (!list || !confirm(`Delete "${list.title}"? This can't be undone.`)) return;
    const { error } = await createClient().from("checklists").delete().eq("id", id);
    if (error) {
      console.error(error);
      setError("That list couldn't be deleted. Please try again.");
      return;
    }
    const rest = lists.filter((l) => l.id !== id);
    setLists(rest);
    setSelected(rest[0]?.id ?? null);
  }

  if (loading) return <p className="text-center font-serif text-lg text-cocoa/70">Loading your lists…</p>;

  const current = lists.find((l) => l.id === selected) ?? null;

  return (
    <div>
      {error && (
        <p role="alert" className="mb-6 border border-red-800/30 bg-red-50 p-3 text-center font-serif text-base text-red-900">
          {error}
        </p>
      )}

      {lists.length === 0 ? (
        // First visit: show the choice straight away
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-rose-deep">Start your first list</p>
          <h2 className="mt-2 text-center font-script text-5xl text-denim">What would you like to do?</h2>
          <NewList onCreate={create} />
        </div>
      ) : (
        <div className="grid items-start gap-6 md:grid-cols-[17rem_1fr]">
          {/* My lists */}
          <aside className="border border-cocoa/20 bg-paper p-4">
            <p className="px-2 text-[0.6rem] uppercase tracking-[0.3em] text-cocoa/60">My lists</p>
            <ul className="mt-3 space-y-1">
              {lists.map((l) => {
                const done = l.items.filter((i) => i.done).length;
                const active = l.id === selected;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(l.id)}
                      aria-current={active}
                      className={`flex w-full items-center gap-3 px-2 py-2 text-left transition ${
                        active ? "bg-rose/40" : "hover:bg-rose/20"
                      }`}
                    >
                      <span aria-hidden="true" className="text-xl">{l.emoji ?? "📝"}</span>
                      <span className="min-w-0 flex-1 truncate font-serif text-lg text-ink">{l.title}</span>
                      <span className="shrink-0 font-sans text-xs text-cocoa/60">
                        {done}/{l.items.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={() => setCreating(true)} className={`${btnDark} mt-4 w-full py-3`}>
              + New list
            </button>
          </aside>

          {current && (
            <ListView
              key={current.id}
              list={current}
              onChange={(patch, persist) => change(current.id, patch, persist)}
              onDelete={() => remove(current.id)}
            />
          )}
        </div>
      )}

      {creating && (
        <Modal title="New list" onClose={() => setCreating(false)}>
          <NewList onCreate={create} />
        </Modal>
      )}
    </div>
  );
}

// One list: tick things off, add, edit and remove items
function ListView({
  list,
  onChange,
  onDelete,
}: {
  list: List;
  onChange: (patch: Partial<Omit<List, "id">>, persist?: boolean) => void;
  onDelete: () => void;
}) {
  const [newItem, setNewItem] = useState("");
  const done = list.items.filter((i) => i.done).length;
  const total = list.items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const setItems = (items: Item[], persist = true) => onChange({ items }, persist);

  function add(e: React.FormEvent) {
    e.preventDefault();
    const text = newItem.trim();
    if (!text || total >= 100) return;
    setItems([...list.items, { id: newId(), text: text.slice(0, MAX_TASK), done: false }]);
    setNewItem("");
  }

  function move(index: number, delta: number) {
    const to = index + delta;
    if (to < 0 || to >= total) return;
    const items = [...list.items];
    [items[index], items[to]] = [items[to], items[index]];
    setItems(items);
  }

  return (
    <section>
      {/* The page of a vintage notebook (a real photo, cut into strips so the
          middle can grow with the list). Multiply lets the photo's white
          background melt into the site's cream. */}
      <div className={`notebook relative -mx-4 sm:mx-0 ${hand.className}`}>
        <div className="notebook-paper absolute inset-0 flex flex-col" aria-hidden="true">
          <div className="notebook-top" />
          <div className="notebook-mid flex-1" />
          <div className="notebook-bottom" />
        </div>

        <div className="notebook-page relative">
          <div className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1 text-2xl sm:text-3xl">{list.emoji ?? "📝"}</span>
            <textarea
              aria-label="List name"
              rows={1}
              ref={autoGrow}
              value={list.title}
              maxLength={80}
              onChange={(e) => {
                autoGrow(e.target);
                onChange({ title: e.target.value.replace(/\n/g, " ") }, false);
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), e.currentTarget.blur())}
              onBlur={(e) => onChange({ title: e.target.value.trim() || "My list" })}
              className={`ink min-w-0 flex-1 resize-none overflow-hidden bg-transparent py-1 text-4xl leading-[1.15] outline-none focus:bg-white/20 sm:text-6xl ${titleHand.className}`}
            />
          </div>
          {resetNote(list.resets) && (
            <p className="mt-1 text-lg font-semibold text-cocoa sm:text-xl">↻ {resetNote(list.resets).toLowerCase()}</p>
          )}

          {/* Progress */}
          <div className="mt-3 flex items-baseline justify-between text-lg font-semibold text-cocoa sm:mt-4 sm:text-2xl">
            <span>
              {total === 0 ? "no tasks yet…" : done === total ? "all done, bestie ♡" : `${done} of ${total} done`}
            </span>
            <span className="text-lg">{pct}%</span>
          </div>
          <div className="mt-1 h-[3px] bg-white/35" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-[#1f2c4d]/80 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          {/* Tasks, written on faint lines */}
          <ul className="mt-4">
            {list.items.map((item, i) => (
              <li key={item.id} className="group flex items-start gap-2.5 border-b border-white/35 py-1.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  aria-label={item.done ? `Untick ${item.text}` : `Tick ${item.text}`}
                  onClick={() => setItems(list.items.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)))}
                  className="mt-1 flex h-5 w-5 shrink-0 sm:mt-1.5 items-center justify-center rounded-[3px] border-[1.5px] border-[#1f2c4d]/75 transition hover:bg-white/25"
                >
                  {item.done && (
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="-mt-1 ml-1 overflow-visible">
                      <path d="M3 10.5c2 1.6 3.4 3.4 4.6 5.6C10 10 13.6 5.4 19 1.5" fill="none" stroke="#1f2c4d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <TaskText
                    value={item.text}
                    onChange={(text) => setItems(list.items.map((x) => (x.id === item.id ? { ...x, text } : x)), false)}
                    onBlur={() => {
                      if (item.text.trim()) setItems(list.items);
                      else setItems(list.items.filter((x) => x.id !== item.id));
                    }}
                    done={item.done}
                  />
                  <TaskLinks text={item.text} />
                </div>
                {/* Reorder and remove: always on phones, on hover on desktop */}
                <span className="mt-1 flex shrink-0 items-center font-sans text-sm text-[#1f2c4d]/60 sm:opacity-0 sm:transition sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="px-0.5 hover:text-[#1f2c4d] disabled:opacity-30">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === total - 1} aria-label="Move down" className="px-0.5 hover:text-[#1f2c4d] disabled:opacity-30">
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems(list.items.filter((x) => x.id !== item.id))}
                    aria-label={`Remove ${item.text}`}
                    className="px-0.5 text-lg leading-none hover:text-red-900"
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <form onSubmit={add} className="mt-2 flex items-center gap-2">
            <span aria-hidden="true" className="ink text-2xl opacity-60">+</span>
            <input
              aria-label="New task"
              value={newItem}
              maxLength={MAX_TASK}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={total >= 100 ? "this list is full (100 tasks)" : "write a task, or paste a link…"}
              disabled={total >= 100}
              className="ink min-w-0 flex-1 border-b border-dashed border-[#1f2c4d]/40 bg-transparent py-1 text-xl sm:text-2xl outline-none placeholder:text-[#1f2c4d]/45 focus:border-[#1f2c4d]/80"
            />
            <button
              type="submit"
              disabled={!newItem.trim()}
              className="ink px-1 text-xl underline decoration-1 underline-offset-4 disabled:opacity-30"
            >
              add
            </button>
          </form>
        </div>
      </div>

      {/* List settings */}
      <div className="mt-4 flex flex-wrap items-center gap-3 px-1">
        <label className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/70">
          Starts over
          <select
            value={list.resets}
            onChange={(e) => {
              const resets = e.target.value as Resets;
              onChange({ resets, last_reset: resets === "never" ? null : periodStart(resets) });
            }}
            className="border border-cocoa/30 bg-cream px-2 py-1.5 font-serif text-base normal-case tracking-normal text-cocoa outline-none focus:border-denim"
          >
            {RESETS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setItems(list.items.map((i) => ({ ...i, done: false })))}
          disabled={done === 0}
          className={btn}
        >
          Untick all
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="ml-auto px-2 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-red-800 hover:underline"
        >
          Delete list
        </button>
      </div>
    </section>
  );
}

// Choose a ready-made list or start a blank one
function NewList({
  onCreate,
}: {
  onCreate: (d: { title: string; emoji: string; template: string | null; resets: Resets; items: string[] }) => Promise<void>;
}) {
  const [mode, setMode] = useState<"ready" | "blank">("ready");
  const [preview, setPreview] = useState<ChecklistTemplate | null>(null);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [resets, setResets] = useState<Resets>("never");

  async function run(d: Parameters<typeof onCreate>[0]) {
    setBusy(true);
    await onCreate(d);
    setBusy(false);
  }

  return (
    <div className="mt-6">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-1" role="tablist">
        {(
          [
            ["ready", "Ready-made"],
            ["blank", "Blank list"],
          ] as const
        ).map(([m, text]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setPreview(null);
            }}
            className={`py-3 text-[0.65rem] uppercase tracking-[0.25em] transition ${
              mode === m ? "bg-denim text-cream" : "border border-cocoa/25 text-cocoa hover:bg-rose/25"
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {mode === "ready" && !preview && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CHECKLIST_TEMPLATES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setPreview(t)}
              className="lift flex items-start gap-3 border border-cocoa/20 bg-cream p-4 text-left hover:border-denim"
            >
              <span aria-hidden="true" className="text-3xl">{t.emoji}</span>
              <span className="min-w-0">
                <span className="block font-script text-3xl leading-tight text-denim">{t.title}</span>
                <span className="mt-1 block font-serif text-base leading-snug text-ink/75">{t.description}</span>
                <span className="mt-2 block text-[0.55rem] uppercase tracking-[0.2em] text-cocoa/60">
                  {t.items.length} tasks{t.resets !== "never" && ` · repeats ${t.resets}`}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {mode === "ready" && preview && (
        <div className="mx-auto mt-6 max-w-lg border border-cocoa/20 bg-cream p-5">
          <button type="button" onClick={() => setPreview(null)} className="text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/70 hover:text-denim">
            ← All lists
          </button>
          <p className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className="text-3xl">{preview.emoji}</span>
            <span className="font-script text-4xl text-denim">{preview.title}</span>
          </p>
          <p className="mt-2 font-serif text-base text-ink/75">{preview.description}</p>
          <ul className="mt-4 space-y-1.5">
            {preview.items.map((text) => (
              <li key={text} className="flex gap-2 font-serif text-base text-ink">
                <span className="mt-1.5 h-3 w-3 shrink-0 border border-cocoa/40" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-serif text-sm text-cocoa/70">You can add, edit or remove tasks after.</p>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run({ title: preview.title, emoji: preview.emoji, template: preview.key, resets: preview.resets, items: preview.items })
            }
            className={`${btnDark} mt-4 w-full py-3`}
          >
            {busy ? "Adding…" : "Use this list"}
          </button>
        </div>
      )}

      {mode === "blank" && (
        <form
          className="mx-auto mt-6 max-w-lg space-y-5 border border-cocoa/20 bg-cream p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim()) run({ title, emoji, template: null, resets, items: [] });
          }}
        >
          <label className={label}>
            Name your list *
            <input
              required
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Shop restock, Wedding season prep"
              className={`${input} bg-paper`}
            />
          </label>
          <fieldset>
            <legend className={label}>Pick an icon</legend>
            <div className="mt-2 flex flex-wrap gap-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  aria-pressed={emoji === e}
                  onClick={() => setEmoji(e)}
                  className={`flex h-10 w-10 items-center justify-center text-xl transition ${
                    emoji === e ? "bg-rose/60 ring-1 ring-cocoa/40" : "hover:bg-rose/25"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={label}>Starts over</legend>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {RESETS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={resets === r.value}
                  onClick={() => setResets(r.value)}
                  className={`py-2 text-[0.6rem] uppercase tracking-[0.15em] transition ${
                    resets === r.value ? "bg-denim text-cream" : "border border-cocoa/25 text-cocoa hover:bg-rose/25"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </fieldset>
          <button type="submit" disabled={busy || !title.trim()} className={`${btnDark} w-full py-3`}>
            {busy ? "Creating…" : "Create list"}
          </button>
        </form>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-cocoa/25 bg-paper p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-script text-4xl text-denim">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl text-cocoa/60 hover:text-cocoa">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// A task's text: wraps onto more lines when it's long, and can be edited in place
function TaskText({
  value,
  done,
  onChange,
  onBlur,
}: {
  value: string;
  done: boolean;
  onChange: (text: string) => void;
  onBlur: () => void;
}) {
  return (
    <textarea
      aria-label="Task"
      rows={1}
      ref={autoGrow}
      value={value}
      maxLength={MAX_TASK}
      onChange={(e) => {
        autoGrow(e.target);
        onChange(e.target.value.replace(/\n/g, " "));
      }}
      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), e.currentTarget.blur())}
      onBlur={onBlur}
      className={`ink block w-full resize-none overflow-hidden bg-transparent text-xl leading-snug [overflow-wrap:anywhere] sm:text-2xl outline-none focus:bg-white/20 ${
        done ? "line-through decoration-[#1f2c4d]/70 decoration-[1.5px] opacity-55" : ""
      }`}
    />
  );
}

// Little clickable tags under a task for any links in it
function TaskLinks({ text }: { text: string }) {
  const links = findLinks(text);
  if (links.length === 0) return null;
  return (
    <span className="mb-1 flex flex-wrap gap-1.5">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          title={l.href}
          className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/45 px-2.5 py-0.5 font-sans text-xs text-[#1f2c4d] transition hover:bg-white/75"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
            <path d="M5 2H2v8h8V7M7 1.5h3.5V5M10.5 1.5 5.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className="truncate">Open {l.label}</span>
        </a>
      ))}
    </span>
  );
}
