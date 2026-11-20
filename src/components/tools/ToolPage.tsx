import { Suspense } from "react";
import Link from "next/link";
import ToolGate from "@/components/tools/ToolGate";

// Shared layout for each creator tool page.
export default function ToolPage({
  eyebrow,
  title,
  intro,
  path,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-script text-6xl text-periwinkle md:text-8xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            {intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <Suspense
          fallback={
            <p className="text-center font-serif text-lg text-cocoa/70">
              Loading...
            </p>
          }
        >
          <ToolGate path={path}>{children}</ToolGate>
        </Suspense>
      </section>

      <section className="border-t border-cocoa/15 py-10 text-center">
        <Link
          href="/tools"
          className="text-[0.7rem] uppercase tracking-[0.25em] text-cocoa hover:text-denim"
        >
          ← All creator tools
        </Link>
      </section>
    </div>
  );
}
