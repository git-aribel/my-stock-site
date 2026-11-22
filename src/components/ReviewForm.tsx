"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewFormState } from "@/app/reviews/actions";
import type { Review } from "@/lib/reviews";

const input =
  "w-full rounded-[8px] border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-ink outline-none focus:border-denim";
const label = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa";

export default function ReviewForm({ existing }: { existing: Review | null }) {
  const [state, action, pending] = useActionState<ReviewFormState, FormData>(submitReview, {});
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);

  if (state.ok) {
    return (
      <div className="text-center">
        <p className="font-script text-4xl text-denim">Thank you, bestie!</p>
        <p className="mx-auto mt-3 max-w-md font-serif text-lg text-ink/80">
          Your review has been sent. It will appear on the site once we&apos;ve had a quick look.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <fieldset>
        <legend className={label}>Your rating</legend>
        <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              aria-pressed={rating === n}
              className={`text-3xl leading-none transition ${
                n <= (hover || rating) ? "text-rose-deep" : "text-cocoa/20"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating || ""} />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Your name</span>
          <input name="name" required maxLength={60} defaultValue={existing?.name} placeholder="e.g. Sofia" className={`${input} mt-2`} />
        </label>
        <label className="block">
          <span className={label}>What you do (optional)</span>
          <input
            name="role"
            maxLength={80}
            defaultValue={existing?.role ?? ""}
            placeholder="e.g. Café owner, UGC creator"
            className={`${input} mt-2`}
          />
        </label>
      </div>

      <label className="block">
        <span className={label}>Your review</span>
        <textarea
          name="body"
          required
          minLength={10}
          maxLength={800}
          rows={5}
          defaultValue={existing?.body}
          placeholder="What did you use, and how did it help your content?"
          className={`${input} mt-2`}
        />
      </label>

      {state.error && <p className="font-serif text-lg text-red-800">{state.error}</p>}

      <button
        disabled={pending}
        className="w-full rounded-full bg-cocoa px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : existing ? "Update my review" : "Send my review"}
      </button>
      <p className="font-serif text-base text-cocoa/60">
        Reviews show your name and what you do, never your email. We check each one before it appears.
      </p>
    </form>
  );
}
