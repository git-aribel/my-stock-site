import type { Metadata } from "next";
import Link from "next/link";
import DashboardPreview from "@/components/DashboardPreview";
import {
  COMMISSION_MONTHS,
  COMMISSION_PERCENT,
  COOKIE_DAYS,
  HOLD_DAYS,
  MIN_PAYOUT_CENTS,
  formatMoney,
} from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Earn recurring commission by sharing Socials Bestie, the content studio for small businesses and creators. Free to join.",
};

const JOIN_HREF = "/affiliates/join";

const steps = [
  {
    title: "Sign up for free",
    text: "Create your account, pick your own code and tell us where to send your earnings.",
  },
  {
    title: "Get your link",
    text: "Once you're approved, your dashboard gives you a personal link to share.",
  },
  {
    title: "Share & earn",
    text: `Earn ${COMMISSION_PERCENT}% of every payment from the members you refer.`,
  },
];

const reasons = [
  {
    title: "Recurring income",
    text: `You don't earn once. You earn ${COMMISSION_PERCENT}% of every payment for the first ${COMMISSION_MONTHS} months of each membership.`,
  },
  {
    title: "Easy to recommend",
    text: "Organic videos, Canva templates, images and stickers that don't feel like stock, and that creators actually use. All in one membership.",
  },
  {
    title: "Made for creators",
    text: "Perfect if you share content tips, aesthetic feeds, small business advice or social media help.",
  },
];

const faqs = [
  {
    q: "Is it free to join?",
    a: "Yes. Joining the affiliate program costs nothing.",
  },
  {
    q: "Do I need to be a member?",
    a: "No. You only need a free account. Of course, it's easier to recommend something you use yourself.",
  },
  {
    q: "Do I need a big audience?",
    a: "No. A small, engaged audience that trusts your recommendations often works better than a big one.",
  },
  {
    q: "How does my link work?",
    a: `When someone visits through your link and accepts our referral cookie, we remember you for ${COOKIE_DAYS} days. If they buy their first membership in that time, you get the credit. You can add your code to any page, like the pricing page.`,
  },
  {
    q: "How much can I earn?",
    a: `You earn ${COMMISSION_PERCENT}% of each payment, before taxes, for the first ${COMMISSION_MONTHS} months of every membership you refer. There's no limit on how many people you can refer.`,
  },
  {
    q: "How do I track my earnings?",
    a: "Your affiliate dashboard shows every payment from your referrals, what's on hold, what's ready to pay and what you've already been paid.",
  },
  {
    q: "When and how do I get paid?",
    a: `Commissions are held for ${HOLD_DAYS} days in case of refunds. After that, we pay by PayPal at the start of each month, once you have at least ${formatMoney(MIN_PAYOUT_CENTS)} ready to pay.`,
  },
  {
    q: "What if someone gets a refund?",
    a: "Commission on a refunded payment is reduced or cancelled. That's why we wait before paying out.",
  },
];

function JoinButton({ light = false }: { light?: boolean }) {
  return (
    <Link
      href={JOIN_HREF}
      className={`inline-block px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] transition ${
        light
          ? "bg-periwinkle text-cocoa hover:bg-cream"
          : "bg-cocoa text-periwinkle hover:bg-cocoa-deep"
      }`}
    >
      Start earning
    </Link>
  );
}

export default function AffiliatesPage() {
  return (
    <div>
      {/* Intro */}
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Affiliate program
          </p>
          <h1 className="mt-4 font-script text-6xl text-periwinkle md:text-8xl">
            Share the love, earn together
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Earn {COMMISSION_PERCENT}% of every payment, for a whole year, when
            your followers join Socials Bestie. Joining is free and you
            don&apos;t need a big audience.
          </p>
          <div className="mt-10">
            <JoinButton light />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="text-center">
          <h2 className="font-script text-6xl text-denim md:text-7xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-xl text-ink/75">
            Three simple steps, and you can start in a few minutes.
          </p>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="border border-cocoa/25 bg-paper p-8 text-center"
            >
              <p className="font-serif text-4xl text-rose-deep">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[0.75rem] uppercase tracking-[0.25em] text-cocoa">
                {s.title}
              </h3>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink/80">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
        <DashboardPreview />
      </section>

      {/* Why join */}
      <section className="panel-denim">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2 className="text-center font-script text-6xl text-cream md:text-7xl">
            Why join?
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="bg-cream p-8 text-center">
                <h3 className="font-script text-4xl text-denim">{r.title}</h3>
                <p className="mt-3 font-serif text-lg leading-relaxed text-ink/80">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <JoinButton />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h2 className="text-center font-script text-6xl text-denim md:text-7xl">
          Questions
        </h2>
        <div className="mt-10 divide-y divide-cocoa/20 border-y border-cocoa/20">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-2xl text-cocoa/50 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink/75">
                {f.a}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-12 text-center">
          <JoinButton />
          <p className="mt-6 font-serif text-base text-cocoa/60">
            Already an affiliate?{" "}
            <Link href={JOIN_HREF} className="underline hover:text-denim">
              Go to your dashboard
            </Link>
            . See the{" "}
            <Link href="/affiliate-terms" className="underline hover:text-denim">
              Affiliate Terms
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
