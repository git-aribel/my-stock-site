import type { Review } from "@/lib/reviews";

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <p className={`tracking-[0.2em] text-rose-deep ${className}`} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-cocoa/20">{"★".repeat(5 - rating)}</span>
    </p>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-[12px] border border-cocoa/15 bg-paper p-7">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed text-ink/85">
        “{review.body}”
      </blockquote>
      <figcaption className="mt-6">
        <p className="font-script text-2xl text-denim">{review.name}</p>
        {review.role && (
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/60">{review.role}</p>
        )}
      </figcaption>
    </figure>
  );
}
