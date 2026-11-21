import Link from "next/link";
import { SITE_CATEGORY } from "@/lib/site";

// ✏️ HOMEPAGE TEXT
// Tip: once your library grows, add real numbers here (e.g. "500+ videos").

const categories = [
  "Stock videos",
  "Canva templates",
  "Organic images",
  "Stickers",
  "Content calendar",
  "Ary 1.0, your content agent",
  "Done-for-you services",
];

const features = [
  {
    panel: "panel-denim",
    label: "The library",
    title: "Create",
    text: "Download organic stock videos and images that look like you filmed them yourself, then make Canva templates yours with your words, colors and logo.",
    href: "/videos",
  },
  {
    panel: "panel-rose",
    label: "Creator Hub",
    title: "Plan",
    text: "Lay out your week in the content calendar, with social media holidays built in. Preview your grid and set your brand fonts and colors.",
    href: "/tools",
  },
  {
    panel: "panel-mist",
    label: "Ary & services",
    title: "Grow",
    text: "Post consistently with captions and hooks from Ary, your content agent. Want it done for you? We also offer social media management, content creation, UGC and websites.",
    href: "/services",
  },
];

// What a free account gets vs what members get
const freeItems = [
  { title: "Content calendar", text: "Plan your month by week or month, with social media holidays built in." },
  { title: "Grid planner", text: "Preview your Instagram feed and TikTok profile before you post." },
  { title: "Font pairing", text: "Find fonts that look beautiful together, in your own colors." },
  { title: "Color palettes", text: "Build your palette and download your brand board." },
  { title: "Library preview", text: "Peek at a few of our newest videos, images and stickers before you join." },
];

const memberItems = [
  { title: "Organic stock videos", text: "Unlimited real-life clips for Reels, TikToks and Stories." },
  { title: "Organic images", text: "Natural, everyday photos and backgrounds that feel real, not staged." },
  { title: "Canva templates", text: "Editable posts, carousels and stories in your brand style." },
  { title: "Stickers", text: "Little illustrations and details to layer over your designs." },
  { title: "Ary 1.0", text: "Your content agent for captions, hooks and content plans." },
  { title: "Boards", text: "Save your favourites into boards like “Spring launch”." },
  { title: "Bulk downloads & new drops", text: "Download in one click, with fresh content added regularly." },
];

const value = [
  { stat: "Hours back", text: "every week, with no more hunting for content" },
  { stat: "One place", text: "for videos, templates, images and planning" },
  { stat: "Always on-brand", text: "a cohesive look across every post" },
  { stat: "Cancel anytime", text: "no contracts, no surprises" },
];

const pill =
  "inline-block px-8 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.25em] transition";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="linen">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            {SITE_CATEGORY}
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl font-script text-6xl text-periwinkle sm:text-7xl md:text-8xl">
            Everything you need to show up on social media
          </h1>
          <p className="mx-auto mt-10 max-w-2xl font-serif text-xl leading-relaxed text-cream/80">
            Organic stock videos and images that don&apos;t feel like stock,
            editable Canva templates and free planning tools, in one
            membership. And when you want it done for you, our services have
            you covered.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/pricing" className={`${pill} bg-periwinkle text-cocoa hover:bg-cream`}>
              Join the club
            </Link>
            <Link href="/videos" className={`${pill} border border-periwinkle/70 text-periwinkle hover:bg-periwinkle/10`}>
              Browse the library
            </Link>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <div className="overflow-hidden border-y border-cocoa/15 py-4" aria-label="What's inside">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.3em] text-cocoa">
          {[...categories, ...categories].map((c, i) => (
            <span key={i} className="flex items-center gap-10" aria-hidden={i >= categories.length}>
              {c}
              <span className="text-rose-deep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* From chaos to a plan: Create, Plan, Grow */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
        <h2 className="font-script text-5xl text-denim md:text-7xl">
          From content chaos to a clear plan
        </h2>
        <p className="mt-5 text-[0.7rem] uppercase tracking-[0.3em] text-rose-deep">
          Create · Plan · Grow
        </p>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink/80">
          Made for creators and small business owners who are tired of
          last-minute posting and content that doesn&apos;t feel like them.
          Here&apos;s how each part of Socials Bestie helps you stay
          consistent, without the overwhelm.
        </p>
      </section>

      {/* Three feature blocks */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {features.map((f, i) => (
          <Link
            key={f.title}
            href={f.href}
            className="group overflow-hidden rounded-[12px] border border-cocoa/15 bg-cream transition hover:-translate-y-1"
          >
            <div className={`${f.panel} flex h-52 flex-col items-center justify-center`}>
              <p className="font-serif text-2xl text-cream/80">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 px-6 text-center font-script text-5xl text-cream">{f.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-deep">{f.label}</p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink/80">{f.text}</p>
              <p className="mt-5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa group-hover:text-denim">
                Explore →
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Free vs members */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-rose-deep">
          Start free, upgrade when you&apos;re ready
        </p>
        <h2 className="mt-3 text-center font-script text-5xl text-denim md:text-7xl">
          Everything you&apos;ll unlock
        </h2>
        <div className="mt-12 grid items-start gap-6 md:grid-cols-[2fr_3fr]">
          <div className="flex h-full flex-col rounded-[12px] border border-cocoa/20 bg-paper p-8">
            <span className="w-fit bg-rose/50 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
              Free with an account
            </span>
            <ul className="mt-6 flex-1 space-y-5">
              {freeItems.map((item) => (
                <li key={item.title}>
                  <p className="font-script text-3xl text-denim">{item.title}</p>
                  <p className="mt-1 font-serif text-lg leading-relaxed text-ink/80">{item.text}</p>
                </li>
              ))}
            </ul>
            <Link href="/signup?next=/tools" className={`${pill} mt-8 border border-cocoa text-cocoa hover:bg-rose/40`}>
              Create a free account
            </Link>
          </div>

          <div className="flex h-full flex-col rounded-[12px] bg-cocoa p-8 text-cream">
            <span className="w-fit bg-periwinkle px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
              Members · everything free, plus
            </span>
            <ul className="mt-6 grid flex-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {memberItems.map((item) => (
                <li key={item.title}>
                  <p className="font-script text-3xl text-periwinkle">{item.title}</p>
                  <p className="mt-1 font-serif text-lg leading-relaxed text-cream/80">{item.text}</p>
                </li>
              ))}
            </ul>
            <Link href="/pricing" className={`${pill} mt-8 bg-periwinkle text-cocoa hover:bg-cream`}>
              Join the club
            </Link>
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="panel-denim">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:py-20">
          <h2 className="font-script text-5xl text-cream md:text-7xl">
            Like having a content team behind you
          </h2>
          <p className="mt-4 font-serif text-xl text-cream/85">
            for less than 50 cents a day on the Annual plan
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {value.map((v) => (
              <div key={v.stat} className="rounded-[12px] border border-cream/30 p-6">
                <p className="text-lg text-dusty-blue">✓</p>
                <p className="mt-2 font-script text-3xl text-cream">{v.stat}</p>
                <p className="mt-2 font-serif text-lg text-cream/80">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome offer */}
      <section className="mx-auto mt-20 max-w-5xl px-6">
        <div className="panel-rose flex flex-col items-center gap-6 px-8 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cocoa/80">Welcome offer</p>
            <h2 className="mt-2 font-script text-5xl text-cocoa md:text-6xl">15% off, bestie</h2>
            <p className="mt-3 max-w-md font-serif text-xl text-cocoa/85">
              Join our email list and get 15% off your first membership payment,
              on any plan.
            </p>
          </div>
          <Link href="/welcome-offer" className={`${pill} shrink-0 bg-cocoa text-cream hover:bg-cocoa-deep`}>
            Get my 15% off
          </Link>
        </div>
      </section>

      {/* Closing */}
      <div className="pt-16" />
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Your new content routine starts here
          </p>
          <h2 className="mt-5 text-balance font-script text-5xl text-periwinkle md:text-7xl">
            Show up on social media, without the stress
          </h2>
          <p className="mx-auto mt-8 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Content that feels like you, a plan for every week and Ary on your
            side. Start with our free planning tools, or join the club and
            unlock the whole library.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/pricing" className={`${pill} bg-periwinkle text-cocoa hover:bg-cream`}>
              Join the club
            </Link>
            <Link
              href="/signup?next=/tools"
              className={`${pill} border border-periwinkle/70 text-periwinkle hover:bg-periwinkle/10`}
            >
              Start for free
            </Link>
          </div>
          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.25em] text-cream/60">
            From $15 a month on the Annual plan · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
