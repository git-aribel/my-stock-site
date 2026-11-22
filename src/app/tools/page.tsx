import type { Metadata } from "next";
import Link from "next/link";
import { ASSISTANT_SKILLS } from "@/lib/assistant";
import AryAvatar from "@/components/AryAvatar";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Creator Hub",
  description:
    "Free social media tools for small businesses and creators: a content calendar with social media holidays, to-do lists for creators, an Instagram & TikTok grid planner, a font pairing generator, a color palette generator and Ary 1.0, your content agent.",
};

const tools = [
  {
    href: "/tools/content-calendar",
    name: "Content calendar",
    text: "Plan what to post and when, with captions, posting times and progress for every post.",
    art: (
      <div className="grid w-28 grid-cols-7 gap-0.5">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            className="aspect-square"
            style={{ background: [2, 5, 9, 13, 16, 20, 24].includes(i) ? ["#c79f9b", "#46608a", "#4a2f27", "#8ea7bf"][i % 4] : "#f6f0e6" }}
          />
        ))}
      </div>
    ),
  },
  {
    href: "/tools/to-do-lists",
    name: "To-do lists",
    text: "Ready-made checklists for creators and brands, or your own lists. Daily and weekly routines reset themselves.",
    art: (
      <div className="w-28 space-y-1.5">
        {[true, true, false].map((done, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className={`h-3.5 w-3.5 shrink-0 border ${done ? "border-denim bg-denim" : "border-cocoa/40 bg-cream"}`} />
            <span className={`h-1.5 flex-1 ${done ? "bg-rose" : "bg-dusty-blue"}`} style={{ width: `${[80, 60, 70][i]}%` }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    href: "/tools/grid-planner",
    name: "Grid planner",
    text: "Preview your next Instagram posts or TikTok videos together and find the perfect order.",
    art: (
      <div className="grid w-24 grid-cols-3 gap-0.5">
        {["#dcbdb8", "#8ea7bf", "#f6f0e6", "#46608a", "#dcbdb8", "#b9c8f2", "#f6f0e6", "#4a2f27", "#8ea7bf"].map((c, i) => (
          <span key={i} className="aspect-[3/4]" style={{ background: c }} />
        ))}
      </div>
    ),
  },
  {
    href: "/tools/font-pairing",
    name: "Font pairings",
    text: "Try beautiful font combinations on your own words and copy them in one click.",
    art: <span className="font-script text-7xl text-denim">Aa</span>,
  },
  {
    href: "/tools/color-palette",
    name: "Color palettes",
    text: "Create a palette, pull colors from a photo and download your brand board.",
    art: (
      <div className="flex h-16 w-28 overflow-hidden">
        {["#f6f0e6", "#dcbdb8", "#8ea7bf", "#46608a", "#4a2f27"].map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    ),
  },
];

export default function ToolsPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Creator Hub
          </p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            Your little studio
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Everything you need to plan, write and design your content. Free
            tools for everyone, and Ary 1.0, your content agent, for members.
          </p>
        </div>
      </section>

      {/* Ary, the content agent (members) */}
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <div className="relative grid gap-10 overflow-hidden bg-cocoa p-8 text-cream md:grid-cols-[1.1fr_1fr] md:p-12">
          <div>
            <span className="bg-periwinkle px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
              Members only
            </span>
            <div className="mt-5 flex items-center gap-4">
              <AryAvatar size={72} />
              <div>
                <h2 className="whitespace-nowrap font-script text-5xl text-periwinkle sm:text-6xl lg:text-7xl">Meet Ary 1.0</h2>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/70">Your content agent</p>
              </div>
            </div>
            <p className="mt-4 font-serif text-xl leading-relaxed text-cream/85">
              Like having a social media manager on call. Ask for captions,
              ideas or a plan, and get answers made for your brand.
            </p>
            <ul className="mt-6 space-y-3">
              {ASSISTANT_SKILLS.map((s) => (
                <li key={s.title} className="flex gap-3 font-serif text-lg text-cream/85">
                  <span className="text-periwinkle">✦</span>
                  <span>
                    <strong className="font-medium text-cream">{s.title}.</strong> {s.text}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/tools/ary"
              className="mt-8 inline-block bg-periwinkle px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-cream"
            >
              Chat with Ary
            </Link>
          </div>

          {/* A little preview of a chat */}
          <div aria-hidden="true" className="flex flex-col justify-center gap-3 font-serif text-lg">
            <p className="ml-auto max-w-[85%] bg-periwinkle px-4 py-3 text-cocoa">
              Write a hook for my coffee shop&apos;s new autumn latte reel ☕
            </p>
            <div className="flex max-w-[95%] items-end gap-2">
            <AryAvatar size={36} />
            <div className="bg-cream px-4 py-3 text-ink">
              <p>Here are 3 hooks to try:</p>
              <p className="mt-2">1. &ldquo;The latte you&apos;ll be thinking about all week…&rdquo;</p>
              <p>2. &ldquo;POV: autumn just arrived in a cup.&rdquo;</p>
              <p className="mt-2 text-base text-cocoa/70">
                Pair it with one of the cozy café videos from the library.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pt-14 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cocoa/60">
          Free with any account
        </p>
      </section>

      <Reveal as="section" stagger className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 pt-6 md:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex flex-col items-center border border-cocoa/25 bg-paper p-8 text-center lift hover:border-denim md:last:odd:col-span-2 md:last:odd:mx-auto md:last:odd:w-[calc(50%-0.75rem)]"
          >
            <div className="flex h-36 items-center justify-center">{t.art}</div>
            <h2 className="font-script text-5xl text-denim">{t.name}</h2>
            <p className="mt-3 flex-1 font-serif text-lg leading-relaxed text-ink/80">
              {t.text}
            </p>
            <span className="mt-6 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa group-hover:text-denim">
              Open tool →
            </span>
          </Link>
        ))}
      </Reveal>

      <section className="panel-denim">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-script text-6xl text-cream">Free account, free tools</h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-xl text-cream/85">
            Sign up for free to use the calendar, to-do lists, planner, fonts and palettes. Join the
            club to unlock Ary 1.0, your content agent, and unlimited downloads.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup?next=/tools" className="bg-cream px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-periwinkle">
              Create free account
            </Link>
            <Link href="/pricing" className="border border-cream px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cream transition hover:bg-cream/10">
              See membership
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
