import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { REVIEW_COLUMNS, getApprovedReviews, type Review } from "@/lib/reviews";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import Reveal from "@/components/Reveal";
import { deleteReview } from "./actions";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What creators and small businesses say about Socials Bestie: organic stock videos, Canva templates and free content planning tools.",
};

const button =
  "inline-block px-8 py-3.5 text-center text-[0.7rem] uppercase tracking-[0.25em] transition";

async function ReviewList() {
  await connection();
  const supabase = await createClient();
  const reviews = await getApprovedReviews(supabase);

  if (reviews.length === 0) {
    return (
      <p className="mx-auto max-w-xl text-center font-serif text-xl leading-relaxed text-ink/75">
        No reviews yet, we&apos;re brand new! Be the very first to share what you think below.
      </p>
    );
  }
  return (
    <Reveal stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </Reveal>
  );
}

async function WriteReview() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-center">
        <p className="mx-auto max-w-md font-serif text-xl leading-relaxed text-ink/80">
          Reviews are written by people with a Socials Bestie account. It&apos;s
          free, and you get our content planning tools too.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/signup?next=/reviews%23write" className={`${button} bg-cocoa text-periwinkle hover:bg-cocoa-deep`}>
            Create a free account
          </Link>
          <Link href="/login?next=/reviews%23write" className={`${button} border border-cocoa text-cocoa hover:bg-rose/40`}>
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase.from("reviews").select(REVIEW_COLUMNS).eq("user_id", user.id).maybeSingle();
  const existing = (data as Review | null) ?? null;

  return (
    <div>
      {existing && (
        <div className="mb-8 rounded-[10px] bg-rose/30 px-5 py-4 font-serif text-lg text-ink/85">
          {existing.status === "approved" && "Your review is live. Thank you! You can edit it below (edits are checked again)."}
          {existing.status === "pending" && "Thanks! Your review is waiting for a quick check before it appears."}
          {existing.status === "hidden" && "Your review isn't shown on the site. You can edit it below and send it again."}
          <form action={deleteReview} className="mt-2">
            <button className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa underline-offset-4 hover:underline">
              Delete my review
            </button>
          </form>
        </div>
      )}
      <ReviewForm existing={existing} />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">Reviews</p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-8xl">Kind words</h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Honest feedback from the creators and small businesses using Socials Bestie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Suspense fallback={<div className="h-40" />}>
          <ReviewList />
        </Suspense>
      </section>

      <section id="write" className="mx-auto max-w-2xl scroll-mt-32 px-6 pb-20">
        <div className="rounded-[12px] border border-cocoa/20 bg-paper p-8 md:p-10">
          <h2 className="text-center font-script text-5xl text-denim">Leave a review</h2>
          <div className="mt-8">
            <Suspense fallback={<div className="h-40" />}>
              <WriteReview />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
