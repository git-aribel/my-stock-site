"use client";

import { useState } from "react";
import Link from "next/link";
import { Caveat, Parisienne } from "next/font/google";
import LacePaper from "@/components/LacePaper";
import { useGoogleFonts } from "@/lib/useGoogleFonts";

// ✏️ HOMEPAGE "PEEK INSIDE" SECTION
// Example content filled into the free Creator Hub tools, so people can see
// what they get before signing up. Change the sample posts, tasks, fonts and
// colors below.

const script = Parisienne({ subsets: ["latin"], weight: "400" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"] });

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#c79f9b",
  TikTok: "#4a2f27",
  Pinterest: "#b3261e",
  Facebook: "#46608a",
};

const SAMPLE_WEEK: { day: string; date: number; posts: { platform: string; meta: string; title: string }[]; holiday?: string }[] = [
  { day: "Mon", date: 3, posts: [{ platform: "Instagram", meta: "9:00 · Reel · Scheduled", title: "Morning routine with our new candle" }] },
  { day: "Tue", date: 4, posts: [{ platform: "TikTok", meta: "18:00 · Video · Drafted", title: "3 ways to style your shelf" }] },
  { day: "Wed", date: 5, holiday: "World Wildlife Day", posts: [{ platform: "Pinterest", meta: "Pin · Idea", title: "Spring mood board" }] },
  { day: "Thu", date: 6, posts: [
    { platform: "Instagram", meta: "12:00 · Carousel · Scheduled", title: "Behind the scenes of the shoot" },
    { platform: "Instagram", meta: "Story · Idea", title: "Poll: which scent next?" },
  ] },
  { day: "Fri", date: 7, posts: [{ platform: "Facebook", meta: "10:00 · Post · Drafted", title: "Weekend giveaway" }] },
  { day: "Sat", date: 8, holiday: "International Women's Day", posts: [{ platform: "Instagram", meta: "Reel · Idea", title: "Thank you to the women behind our brand" }] },
  { day: "Sun", date: 9, posts: [] },
];

const SAMPLE_TASKS = [
  { text: "Hook in the first 3 seconds", done: true },
  { text: "On-screen text or captions added", done: true },
  { text: "Caption with a call to action", done: true },
  { text: "Keywords and hashtags added", done: false },
  { text: "Cover image chosen", done: false },
  { text: "Posted at your best time", done: false },
];

const SAMPLE_PALETTE = [
  { name: "Espresso", hex: "#3f2a24", light: false },
  { name: "Dusty rose", hex: "#c79f9b", light: true },
  { name: "Oat milk", hex: "#e8dccf", light: true },
  { name: "Sky", hex: "#8ea7bf", light: true },
  { name: "Linen", hex: "#f6f1ea", light: true },
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

      <div role="tabpanel" className="mt-8">
        {tab === "calendar" && <CalendarExample />}
        {tab === "todo" && <TodoExample />}
        {tab === "brand" && <BrandExample />}
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

function CalendarExample() {
  return (
    <div className="-mx-6 rounded-[12px] bg-cocoa-deep px-1.5 py-4 sm:mx-0 sm:p-6 md:p-10" aria-label="Example content calendar">
      <LacePaper>
        <div className="px-2 pb-2 pt-3 text-center sm:px-6 md:pt-6">
          <h3 className={`leading-none text-cocoa-deep ${script.className} text-[2.6rem] sm:text-6xl md:text-7xl`}>Launch week</h3>
          <p className="mt-2 text-xs tracking-[0.12em] text-cocoa-deep sm:mt-3 sm:text-base">WEEKLY PLAN</p>
        </div>
        <div className="px-1 pb-2 pt-5 sm:px-4 md:pt-8">
          {/* Week grid (tablets and up) */}
          <div className="hidden grid-cols-7 border-l border-t border-cocoa/35 md:grid">
            {SAMPLE_WEEK.map((d) => (
              <div key={d.day} className="min-h-[190px] border-b border-r border-cocoa/35 p-1.5">
                <p className="pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-cocoa-deep">
                  {d.day} <span className="font-sans">{d.date}</span>
                </p>
                <div className="space-y-1">
                  {d.holiday && <Holiday name={d.holiday} />}
                  {d.posts.map((p) => (
                    <Chip key={p.title} {...p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Day list (phones) */}
          <div className="space-y-3 md:hidden">
            {SAMPLE_WEEK.filter((d) => d.posts.length).slice(0, 4).map((d) => (
              <div key={d.day} className="border border-cocoa/30 bg-white/35 p-3">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-cocoa-deep">
                  {d.day} {d.date}
                </p>
                <div className="mt-2 space-y-1.5">
                  {d.holiday && <Holiday name={d.holiday} />}
                  {d.posts.map((p) => (
                    <Chip key={p.title} {...p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LacePaper>
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

function Chip({ platform, meta, title }: { platform: string; meta: string; title: string }) {
  return (
    <div className="border-l-4 bg-paper px-1.5 py-1 shadow-sm" style={{ borderColor: PLATFORM_COLORS[platform] }}>
      <p className="text-[0.55rem] uppercase tracking-[0.15em] text-cocoa/60">{meta}</p>
      <p className="font-serif text-sm leading-tight text-ink">{title}</p>
    </div>
  );
}

function TodoExample() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  return (
    <div className="mx-auto max-w-[740px]">
      <div className={`notebook relative -mx-6 sm:mx-0 ${hand.className}`} aria-label="Example to-do list">
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
            <span>{done === tasks.length ? "all done, bestie ♡" : `${done} of ${tasks.length} done`}</span>
            <span className="text-lg">{pct}%</span>
          </div>
          <div className="mt-1 h-[3px] bg-white/35">
            <div className="h-full bg-[#1f2c4d]/80 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4">
            {tasks.map((t, i) => (
              <li key={t.text} className="border-b border-white/35 py-1.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={t.done}
                  onClick={() => setTasks(tasks.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-[#1f2c4d]/75 sm:mt-1.5">
                    {t.done && (
                      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="-mt-1 ml-1 overflow-visible">
                        <path d="M3 10.5c2 1.6 3.4 3.4 4.6 5.6C10 10 13.6 5.4 19 1.5" fill="none" stroke="#1f2c4d" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`ink text-xl leading-snug sm:text-2xl ${
                      t.done ? "line-through decoration-[#1f2c4d]/70 decoration-[1.5px] opacity-55" : ""
                    }`}
                  >
                    {t.text}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-2 text-center font-serif text-sm text-cocoa/55">Go on, tick a box.</p>
    </div>
  );
}

function BrandExample() {
  useGoogleFonts(["Italiana", "Jost"]);
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2" aria-label="Example brand fonts and colors">
      {/* Font pairing card */}
      <div className="flex flex-col justify-center rounded-[12px] p-8 text-center" style={{ background: "#3f2a24", color: "#f6f1ea" }}>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: "'Jost', sans-serif" }}>
          Soft Romance · Italiana + Jost
        </p>
        <p className="mt-5 text-5xl leading-tight sm:text-6xl" style={{ fontFamily: "'Italiana', serif", color: "#e8dccf" }}>
          Bloom Studio
        </p>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed opacity-85" style={{ fontFamily: "'Jost', sans-serif" }}>
          Hand-poured candles for slow mornings. New spring scents drop this Friday.
        </p>
        <span
          className="mx-auto mt-6 inline-block rounded-full px-6 py-2 text-[0.65rem] uppercase tracking-[0.25em]"
          style={{ fontFamily: "'Jost', sans-serif", background: "#c79f9b", color: "#3f2a24" }}
        >
          Shop the drop
        </span>
      </div>

      {/* Palette */}
      <div className="rounded-[12px] border border-cocoa/15 bg-paper p-6">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-rose-deep">Brand palette</p>
        <div className="mt-4 flex h-40 overflow-hidden rounded-[8px] sm:h-48">
          {SAMPLE_PALETTE.map((c) => (
            <div key={c.hex} className="flex flex-1 items-end p-2" style={{ background: c.hex, color: c.light ? "#3f2a24" : "#f6f1ea" }}>
              <span className="text-[0.55rem] uppercase tracking-[0.1em]">{c.hex}</span>
            </div>
          ))}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {SAMPLE_PALETTE.map((c) => (
            <li key={c.hex} className="flex items-center gap-2 font-serif text-base text-ink">
              <span className="h-4 w-4 shrink-0 rounded-full border border-cocoa/20" style={{ background: c.hex }} />
              {c.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
