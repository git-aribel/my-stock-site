import Link from "next/link";

export default function SuccessPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-script text-7xl text-periwinkle md:text-9xl">
            Welcome
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Your membership is confirmed. Thank you for joining the club.
          </p>
          <Link
            href="/videos"
            className="mt-10 inline-block bg-periwinkle px-8 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-cream"
          >
            Start browsing
          </Link>
        </div>
      </section>
    </div>
  );
}