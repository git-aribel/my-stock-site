import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getApprovedReviews } from "@/lib/reviews";
import ReviewCard from "@/components/ReviewCard";
import Reveal from "@/components/Reveal";

const button =
  "inline-block px-8 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.25em] transition";

// Before launch there are no reviews yet, so this shows an invitation to be
// the first. Once reviews are approved, the newest three appear instead.
async function Reviews() {
  await connection();
  const supabase = await createClient();
  const reviews = await getApprovedReviews(supabase, 3);

  if (reviews.length === 0) {
    return (
      <Reveal className="mx-auto mt-12 max-w-2xl rounded-[12px] border border-dashed border-cocoa/30 bg-paper px-8 py-12 text-center">
        <p className="tracking-[0.3em] text-rose-deep/50" aria-hidden="true">
          ★★★★★
        </p>
        <h3 className="mt-4 font-script text-4xl text-denim md:text-5xl">Be the first to leave a review</h3>
        <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ink/80">
          We&apos;re brand new and would love to hear from you. Create a free
          account, try the tools or the library, and tell us what you think.
          Your words help other creators find us.
        </p>
        <Link href="/reviews#write" className={`${button} mt-8 bg-cocoa text-periwinkle hover:bg-cocoa-deep`}>
          Leave the first review
        </Link>
      </Reveal>
    );
  }

  return (
    <>
      <Reveal stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </Reveal>
      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link href="/reviews" className={`${button} border border-cocoa text-cocoa hover:bg-rose/40`}>
          Read all reviews
        </Link>
        <Link href="/reviews#write" className={`${button} bg-cocoa text-periwinkle hover:bg-cocoa-deep`}>
          Leave a review
        </Link>
      </div>
    </>
  );
}

export default function ReviewsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <Reveal as="p" className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-rose-deep">
        Reviews
      </Reveal>
      <Reveal as="h2" className="mt-3 text-center font-script text-5xl text-denim md:text-7xl">
        Kind words from our besties
      </Reveal>
      <Suspense fallback={<div className="mt-12 h-64" />}>
        <Reviews />
      </Suspense>
    </section>
  );
}
