"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Caveat, Parisienne } from "next/font/google";
import LacePaper from "@/components/LacePaper";
import { useGoogleFonts } from "@/lib/useGoogleFonts";

// ✏️ HOMEPAGE "PEEK INSIDE" SECTION
// A short, looping demo of each free Creator Hub tool: a cursor adds posts to
// the calendar, ticks off a to-do list and tries fonts and colors, as if
// someone were using them right now. Change the sample content below.

const script = Parisienne({ subsets: ["latin"], weight: "400" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"] });

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#c79f9b",
  TikTok: "#4a2f27",
  Pinterest: "#b3261e",
  Facebook: "#46608a",
};

const WEEK: { day: string; date: number; holiday?: string }[] = [
  { day: "Mon", date: 3 },
  { day: "Tue", date: 4 },
  { day: "Wed", date: 5, holiday: "World Wildlife Day" },
  { day: "Thu", date: 6 },
  { day: "Fri", date: 7 },
  { day: "Sat", date: 8, holiday: "International Women's Day" },
  { day: "Sun", date: 9 },
];

// Posts the demo adds, in order. The last step drags `MOVE` to `MOVE_TO`.
const DEMO_POSTS = [
  { day: "Mon", platform: "Instagram", meta: "9:00 · Reel · Scheduled", title: "Morning routine with our new candle" },
  { day: "Tue", platform: "TikTok", meta: "18:00 · Video · Drafted", title: "3 ways to style your shelf" },
  { day: "Wed", platform: "Pinterest", meta: "Pin · Idea", title: "Spring mood board" },
  { day: "Thu", platform: "Instagram", meta: "12:00 · Carousel · Scheduled", title: "Behind the scenes of the shoot" },
  { day: "Fri", platform: "Facebook", meta: "10:00 · Post · Drafted", title: "Weekend giveaway" },
  { day: "Sat", platform: "Instagram", meta: "Reel · Idea", title: "Thank you to the women behind our brand" },
];
const MOVE = 4;
const MOVE_TO = "Sun";

const DEMO_TASKS = [
  "Hook in the first 3 seconds",
  "On-screen text or captions added",
  "Caption with a call to action",
  "Keywords and hashtags added",
  "Cover image chosen",
  "Posted at your best time",
];
const TICKS = [0, 1, 2, 3]; // which tasks the demo ticks
const NEW_TASK = "Reply to new comments ♡";

const FONT_PAIRS = [
  { name: "Soft Romance", heading: "Italiana", body: "Jost" },
  { name: "Timeless", heading: "Playfair Display", body: "Lato" },
  { name: "Editorial", heading: "Cormorant Garamond", body: "Montserrat" },
];
const PAIR_ORDER = [1, 2, 0]; // the order the demo clicks them in

const PALETTE = [
  { name: "Espresso", hex: "#3f2a24" },
  { name: "Dusty rose", hex: "#c79f9b" },
  { name: "Oat milk", hex: "#e8dccf" },
  { name: "Sky", hex: "#8ea7bf" },
  { name: "Linen", hex: "#f6f1ea" },
];

const TABS = [
  { key: "calendar", label: "Content calendar", href: "/tools/content-calendar", blurb: "Plan your week or month, with social media holidays already added." },
  { key: "todo", label: "To-do lists", href: "/tools/to-do-lists", blurb: "Ready-made checklists for creators, or write your own. Tick as you go." },
  { key: "brand", label: "Fonts & colors", href: "/tools/font-pairing", blurb: "Find fonts that go together and build your brand palette." },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function HubShowcase() {
  const [tab, setTab] = useState<TabKey>("calendar");
  const current = TABS.find((t) => t.key === tab)!;

  return (
    <div>
      <div role="tablist" aria-label="Free tools" className="flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] transition ${
              tab === t.key ? "bg-cocoa text-periwinkle" : "border border-cocoa/30 text-cocoa hover:bg-rose/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-xl text-center font-serif text-lg leading-relaxed text-ink/80">{current.blurb}</p>
      <p className="mt-2 flex items-center justify-center gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-rose-deep">
        <span className="demo-live h-1.5 w-1.5 rounded-full bg-rose-deep" aria-hidden="true" />
        Live demo
      </p>

      <div role="tabpanel" className="mt-6">
        {tab === "calendar" && <CalendarDemo />}
        {tab === "todo" && <TodoDemo />}
        {tab === "brand" && <BrandDemo />}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={current.href}
          className="inline-block border border-cocoa px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
        >
          Try the {current.label.toLowerCase()} free
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The demo runner: plays a script in a loop while it's on screen,     */
/* with a cursor that glides to things and clicks them.                */
/* ------------------------------------------------------------------ */

class Stop extends Error {}

type Demo = {
  wait: (ms: number) => Promise<void>;
  moveTo: (target: string, fy?: number) => Promise<void>;
  click: () => Promise<void>;
  type: (text: string, set: (s: string) => void, speed?: number) => Promise<void>;
};

function useDemo(
  box: React.RefObject<HTMLDivElement | null>,
  run: (d: Demo) => Promise<void>,
  showFinal: () => void,
) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, down: false, on: false });
  const [visible, setVisible] = useState(false);
  const runRef = useRef(run);
  const finalRef = useRef(showFinal);
  runRef.current = run;
  finalRef.current = showFinal;

  // Only play while the demo is on screen
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [box]);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finalRef.current();
      return;
    }
    let stopped = false;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          if (stopped) reject(new Stop());
          else resolve();
        }, ms);
        timers.add(t);
      });

    const find = (key: string) => {
      const els = box.current?.querySelectorAll<HTMLElement>(`[data-demo="${key}"]`) ?? [];
      return [...els].find((e) => e.getClientRects().length > 0);
    };

    const demo: Demo = {
      wait,
      async moveTo(key, fy = 0.5) {
        const el = find(key);
        const b = box.current;
        if (!el || !b) return;
        const r = el.getBoundingClientRect();
        const c = b.getBoundingClientRect();
        setCursor((cur) => ({ ...cur, on: true, x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height * fy }));
        await wait(700);
      },
      async click() {
        setCursor((cur) => ({ ...cur, down: true }));
        await wait(160);
        setCursor((cur) => ({ ...cur, down: false }));
        await wait(120);
      },
      async type(text, set, speed = 32) {
        for (let i = 1; i <= text.length; i++) {
          set(text.slice(0, i));
          await wait(speed);
        }
      },
    };

    (async () => {
      try {
        while (!stopped) await runRef.current(demo);
      } catch (e) {
        if (!(e instanceof Stop)) throw e;
      }
    })();

    return () => {
      stopped = true;
      timers.forEach((t) => window.clearTimeout(t));
      setCursor((cur) => ({ ...cur, on: false }));
    };
  }, [visible, box]);

  return cursor;
}

function Cursor({ x, y, down, on }: { x: number; y: number; down: boolean; on: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`demo-cursor pointer-events-none absolute left-0 top-0 z-30 ${on ? "opacity-100" : "opacity-0"}`}
      style={{ transform: `translate(${x - 3}px, ${y - 2}px)` }}
    >
      <span className={`relative block transition-transform duration-150 ${down ? "scale-[0.82]" : ""}`}>
        {down && <span className="demo-ping absolute -left-2 -top-2 h-5 w-5 rounded-full bg-rose-deep/50" />}
        <svg width="22" height="26" viewBox="0 0 22 26" className="drop-shadow-[0_2px_3px_rgba(54,33,27,0.35)]">
          <path d="M2 1.5v19.2l5.1-4.6 3.3 7.6 3.4-1.5-3.3-7.4 6.9-.3z" fill="#36211b" stroke="#fbf7f0" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

const caret = <span className="demo-caret ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-current" />;

/* ------------------------------------------------------------------ */
/* Content calendar                                                    */
/* ------------------------------------------------------------------ */

type DemoPost = (typeof DEMO_POSTS)[number] & { id: number; text: string; typing: boolean; dragging?: boolean };

function CalendarDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<DemoPost[]>([]);
  const [fading, setFading] = useState(false);

  const cursor = useDemo(
    box,
    async (d) => {
      setPosts([]);
      setFading(false);
      await d.wait(500);
      for (let i = 0; i < DEMO_POSTS.length; i++) {
        const p = DEMO_POSTS[i];
        await d.moveTo(`day-${p.day}`, 0.62);
        await d.click();
        setPosts((all) => [...all, { ...p, id: i, text: "", typing: true }]);
        await d.wait(200);
        await d.type(p.title, (text) => setPosts((all) => all.map((x) => (x.id === i ? { ...x, text } : x))), 30);
        setPosts((all) => all.map((x) => (x.id === i ? { ...x, typing: false } : x)));
        await d.wait(300);
      }
      // Drag a post to another day
      await d.wait(400);
      await d.moveTo(`post-${MOVE}`);
      setPosts((all) => all.map((x) => (x.id === MOVE ? { ...x, dragging: true } : x)));
      await d.wait(250);
      await d.moveTo(`day-${MOVE_TO}`, 0.62);
      setPosts((all) => all.map((x) => (x.id === MOVE ? { ...x, day: MOVE_TO, dragging: false } : x)));
      await d.wait(2600);
      setFading(true);
      await d.wait(500);
    },
    () =>
      setPosts(
        DEMO_POSTS.map((p, i) => ({ ...p, id: i, text: p.title, typing: false, day: i === MOVE ? MOVE_TO : p.day })),
      ),
  );

  const byDay = (day: string) => posts.filter((p) => p.day === day);

  return (
    <div
      ref={box}
      className="keep-colors relative -mx-6 select-none rounded-[12px] bg-cocoa-deep px-1.5 py-4 sm:mx-0 sm:p-6 md:p-10"
      aria-label="Demo of the content calendar"
    >
      <LacePaper>
        <div className="px-2 pb-2 pt-3 text-center sm:px-6 md:pt-6">
          <h3 className={`leading-none text-cocoa-deep ${script.className} text-[2.6rem] sm:text-6xl md:text-7xl`}>Launch week</h3>
          <p className="mt-2 text-xs tracking-[0.12em] text-cocoa-deep sm:mt-3 sm:text-base">WEEKLY PLAN</p>
        </div>
        <div className={`px-1 pb-2 pt-5 transition-opacity duration-500 sm:px-4 md:pt-8 ${fading ? "opacity-0" : ""}`}>
          {/* Week grid (tablets and up) */}
          <div className="hidden grid-cols-7 border-l border-t border-cocoa/35 md:grid">
            {WEEK.map((d) => (
              <div key={d.day} data-demo={`day-${d.day}`} className="min-h-[200px] border-b border-r border-cocoa/35 p-1.5">
                <p className="pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cocoa-deep">
                  {d.day} <span className="font-sans">{d.date}</span>
                </p>
                <div className="space-y-1">
                  {d.holiday && <Holiday name={d.holiday} />}
                  {byDay(d.day).map((p) => (
                    <Chip key={p.id} post={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Day list (phones) */}
          <div className="space-y-2.5 md:hidden">
            {WEEK.map((d) => (
              <div key={d.day} data-demo={`day-${d.day}`} className="min-h-[64px] border border-cocoa/30 bg-white/35 p-2.5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-cocoa-deep">
                  {d.day} {d.date}
                </p>
                <div className="mt-1.5 space-y-1.5">
                  {d.holiday && <Holiday name={d.holiday} />}
                  {byDay(d.day).map((p) => (
                    <Chip key={p.id} post={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LacePaper>
      <Cursor {...cursor} />
    </div>
  );
}

function Holiday({ name }: { name: string }) {
  return (
    <p className="truncate bg-rose/35 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-cocoa" title={name}>
      ✦ {name}
    </p>
  );
}

function Chip({ post }: { post: DemoPost }) {
  return (
    <div
      data-demo={`post-${post.id}`}
      className={`demo-pop border-l-4 bg-paper px-1.5 py-1 shadow-sm transition ${
        post.dragging ? "rotate-2 scale-105 opacity-80 shadow-md" : ""
      }`}
      style={{ borderColor: PLATFORM_COLORS[post.platform] }}
    >
      <p className="text-[0.55rem] uppercase tracking-[0.15em] text-cocoa/60">{post.meta}</p>
      <p className="min-h-[1.25em] font-serif text-sm leading-tight text-ink">
        {post.text}
        {post.typing && caret}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* To-do list                                                          */
/* ------------------------------------------------------------------ */

function TodoDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState(DEMO_TASKS.map((text) => ({ text, done: false })));
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);

  const tick = (i: number) => setTasks((all) => all.map((t, j) => (j === i ? { ...t, done: true } : t)));

  const cursor = useDemo(
    box,
    async (d) => {
      setTasks(DEMO_TASKS.map((text) => ({ text, done: false })));
      setDraft("");
      await d.wait(600);
      for (const i of TICKS) {
        await d.moveTo(`check-${i}`);
        await d.click();
        tick(i);
        await d.wait(350);
      }
      // Write a new task and tick it
      await d.moveTo("add");
      await d.click();
      setTyping(true);
      await d.type(NEW_TASK, setDraft, 45);
      await d.wait(350);
      setTyping(false);
      setDraft("");
      setTasks((all) => [...all, { text: NEW_TASK, done: false }]);
      await d.wait(500);
      await d.moveTo(`check-${DEMO_TASKS.length}`);
      await d.click();
      tick(DEMO_TASKS.length);
      await d.wait(2800);
    },
    () => setTasks(DEMO_TASKS.map((text, i) => ({ text, done: TICKS.includes(i) }))),
  );

  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  return (
    <div ref={box} className="relative mx-auto max-w-[740px] select-none">
      <div className={`notebook relative -mx-6 sm:mx-0 ${hand.className}`} aria-label="Demo of a to-do list">
        <div className="notebook-paper absolute inset-0 flex flex-col" aria-hidden="true">
          <div className="notebook-top" />
          <div className="notebook-mid flex-1" />
          <div className="notebook-bottom" />
        </div>
        <div className="notebook-page relative">
          <div className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1 text-2xl sm:text-3xl">📸</span>
            <h3 className={`ink py-1 text-4xl leading-[1.15] sm:text-6xl ${script.className}`}>Before you post</h3>
          </div>
          <div className="mt-3 flex items-baseline justify-between text-lg font-semibold text-cocoa sm:mt-4 sm:text-2xl">
            <span>{done === 0 ? "let's go, bestie" : `${done} of ${tasks.length} done`}</span>
            <span className="text-lg">{pct}%</span>
          </div>
          <div className="mt-1 h-[3px] bg-white/35">
            <div className="h-full bg-[#1f2c4d]/80 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4">
            {tasks.map((t, i) => (
              <li key={t.text} className="demo-pop flex items-start gap-2.5 border-b border-white/35 py-1.5">
                <span
                  data-demo={`check-${i}`}
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-[#1f2c4d]/75 sm:mt-1.5"
                >
                  {t.done && (
                    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="-mt-1 ml-1 overflow-visible">
                      <path className="demo-tick" pathLength={1} d="M3 10.5c2 1.6 3.4 3.4 4.6 5.6C10 10 13.6 5.4 19 1.5" fill="none" stroke="#1f2c4d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span
                  className={`ink text-xl leading-snug transition-opacity duration-300 sm:text-2xl ${
                    t.done ? "line-through decoration-[#1f2c4d]/70 decoration-[1.5px] opacity-55" : ""
                  }`}
                >
                  {t.text}
                </span>
              </li>
            ))}
          </ul>
          {/* The "add a task" line */}
          <div data-demo="add" className="mt-2 flex items-center gap-2.5 py-1.5">
            <span className="ink flex h-5 w-5 shrink-0 items-center justify-center text-xl leading-none opacity-60">+</span>
            <span className={`ink text-xl leading-snug sm:text-2xl ${draft || typing ? "" : "opacity-40"}`}>
              {draft || (typing ? "" : "write a task…")}
              {typing && caret}
            </span>
          </div>
        </div>
      </div>
      <Cursor {...cursor} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Fonts & colors                                                      */
/* ------------------------------------------------------------------ */

function BrandDemo() {
  useGoogleFonts(FONT_PAIRS.flatMap((p) => [p.heading, p.body]));
  const box = useRef<HTMLDivElement>(null);
  const [pair, setPair] = useState(0);
  const [filled, setFilled] = useState(0);

  const cursor = useDemo(
    box,
    async (d) => {
      setPair(0);
      setFilled(0);
      await d.wait(600);
      for (const i of PAIR_ORDER) {
        await d.moveTo(`pair-${i}`);
        await d.click();
        setPair(i);
        await d.wait(1100);
      }
      for (let i = 0; i < PALETTE.length; i++) {
        await d.moveTo(`swatch-${i}`, 0.45);
        await d.click();
        setFilled(i + 1);
        await d.wait(250);
      }
      await d.wait(2800);
    },
    () => {
      setPair(0);
      setFilled(PALETTE.length);
    },
  );

  const p = FONT_PAIRS[pair];
  const heading = `'${p.heading}', serif`;
  const body = `'${p.body}', sans-serif`;

  return (
    <div ref={box} className="relative mx-auto max-w-4xl select-none" aria-label="Demo of the font pairing and color palette tools">
      {/* Font pair picker */}
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {FONT_PAIRS.map((fp, i) => (
          <span
            key={fp.name}
            data-demo={`pair-${i}`}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              pair === i ? "border-cocoa bg-cocoa text-cream" : "border-cocoa/30 bg-paper text-cocoa"
            }`}
            style={{ fontFamily: `'${fp.heading}', serif` }}
          >
            {fp.name}
          </span>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Font pairing card */}
        <div className="flex min-h-[300px] flex-col justify-center rounded-[12px] p-8 text-center" style={{ background: "#3f2a24", color: "#f6f1ea" }}>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: body }}>
            {p.name} · {p.heading} + {p.body}
          </p>
          <p key={p.heading} className="demo-pop mt-5 text-5xl leading-tight sm:text-6xl" style={{ fontFamily: heading, color: "#e8dccf" }}>
            Bloom Studio
          </p>
          <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed opacity-85" style={{ fontFamily: body }}>
            Hand-poured candles for slow mornings. New spring scents drop this Friday.
          </p>
          <span
            className="mx-auto mt-6 inline-block rounded-full px-6 py-2 text-[0.65rem] uppercase tracking-[0.25em]"
            style={{ fontFamily: body, background: "#c79f9b", color: "#3f2a24" }}
          >
            Shop the drop
          </span>
        </div>

        {/* Palette, filled in one color at a time */}
        <div className="rounded-[12px] border border-cocoa/15 bg-paper p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-rose-deep">Brand palette</p>
          <div className="mt-4 flex h-40 gap-1.5 sm:h-48">
            {PALETTE.map((c, i) => (
              <div
                key={c.hex}
                data-demo={`swatch-${i}`}
                className={`flex flex-1 items-end rounded-[6px] p-2 transition-all duration-500 ${
                  i < filled ? "" : "border border-dashed border-cocoa/30"
                }`}
                style={{ background: i < filled ? c.hex : "transparent" }}
              >
                {i < filled && (
                  <span className="demo-pop text-[0.55rem] uppercase tracking-[0.1em]" style={{ color: i === 0 ? "#f6f1ea" : "#3f2a24" }}>
                    {c.hex}
                  </span>
                )}
              </div>
            ))}
          </div>
          <ul className="mt-5 grid min-h-[3.5rem] grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {PALETTE.slice(0, filled).map((c) => (
              <li key={c.hex} className="demo-pop flex items-center gap-2 font-serif text-base text-ink">
                <span className="h-4 w-4 shrink-0 rounded-full border border-cocoa/20" style={{ background: c.hex }} />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Cursor {...cursor} />
    </div>
  );
}
