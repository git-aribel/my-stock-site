import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { connection } from "next/server";
import {
  CONSENT_TEXT,
  OFFER_COOKIE,
  OFFER_PERCENT,
  getOffer,
  isCodeUsable,
} from "@/lib/welcomeOffer";
import { CodeBox, WelcomeOfferForm } from "@/components/WelcomeOffer";

export const metadata: Metadata = {
  title: `${OFFER_PERCENT}% Off Your First Payment`,
  description: `Join the Socials Bestie email list and get ${OFFER_PERCENT}% off your first membership payment.`,
};

const perks = [
  "Unlimited stock videos, Canva templates, images and stickers",
  "New content added regularly",
  "Boards to organise your favourites",
  "Cancel anytime",
];

async function Offer() {
  await connection();
  const cookieStore = await cookies();
  const offer = await getOffer(cookieStore.get(OFFER_COOKIE)?.value);

  if (offer) {
    const usable = await isCodeUsable(offer.promoCodeId);
    return (
      <div className="mx-auto max-w-2xl border border-cocoa/25 bg-paper p-8 text-center md:p-12">
        <h2 className="font-script text-6xl text-denim">
          {usable ? "Here's your code!" : "Your code"}
        </h2>
        <p className="mx-auto mt-3 max-w-md font-serif text-xl text-ink/75">
          {usable
            ? `${OFFER_PERCENT}% off your first payment. It's applied automatically when you join on this device, or enter it at checkout.`
            : "This code has already been used. Thanks for being a member!"}
        </p>
        <div className="mt-8">
          <CodeBox code={offer.code} />
        </div>
        {usable && (
          <Link
            href="/pricing"
            className="mt-8 inline-block bg-cocoa px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
          >
            Choose your plan
          </Link>
        )}
        <p className="mt-6 font-serif text-base text-cocoa/60">
          One use per person, for new members.
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-10 md:grid-cols-[1fr_minmax(0,420px)]">
      <div>
        <p className="font-script text-6xl text-denim">What you get</p>
        <ul className="mt-6 space-y-3">
          {perks.map((p) => (
            <li key={p} className="flex gap-3 font-serif text-xl text-ink/85">
              <span className="text-denim">✦</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-serif text-lg text-cocoa/70">
          Your {OFFER_PERCENT}% discount works on any plan: Monthly, 3 Months or Annual.
        </p>
      </div>

      <div className="border border-cocoa/25 bg-paper p-6 md:p-8">
        <h2 className="font-script text-5xl text-denim">Get {OFFER_PERCENT}% off</h2>
        <p className="mt-2 font-serif text-lg text-ink/75">
          Join our email list and your personal code appears straight away.
        </p>
        <div className="mt-6">
          <WelcomeOfferForm consentText={CONSENT_TEXT} />
        </div>
      </div>
    </div>
  );
}

export default function WelcomeOfferPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Welcome offer
          </p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            {OFFER_PERCENT}% off, bestie
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Join our email list for ideas, new content and offers, and get{" "}
            {OFFER_PERCENT}% off your first membership payment.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <Suspense fallback={<p className="text-center font-serif text-lg text-cocoa/70">Loading...</p>}>
          <Offer />
        </Suspense>
      </section>
    </div>
  );
}
