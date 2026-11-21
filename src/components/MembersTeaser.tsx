import Link from "next/link";

// Shown under the free preview of the library for non-members
export default function MembersTeaser({
  total,
  shown,
  noun,
  loggedIn,
  next,
}: {
  total: number;
  shown: number;
  noun: string;
  loggedIn: boolean;
  next: string;
}) {
  const hidden = total - shown;
  // "1 more video", "3 more videos"
  const count = (n: number) => `${n} ${n === 1 ? noun.replace(/s$/, "") : noun}`;
  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-[12px] bg-cocoa px-8 py-10 text-center text-cream">
      <span className="bg-periwinkle px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
        Members only
      </span>
      <p className="mt-5 font-script text-4xl text-periwinkle md:text-5xl">
        {shown === 0
          ? `${count(total)} inside`
          : `${hidden} more ${hidden === 1 ? noun.replace(/s$/, "") : noun} inside`}
      </p>
      <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-cream/80">
        {shown === 0
          ? `Join the club to see and edit every one of our ${noun}, with new ones added regularly.`
          : `You're seeing a little preview. Join the club to see and download all of our ${noun}, with new ones added regularly.`}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/pricing"
          className="bg-periwinkle px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-cream"
        >
          Join the club
        </Link>
        {!loggedIn && (
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="border border-periwinkle/70 px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-periwinkle/10"
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}
