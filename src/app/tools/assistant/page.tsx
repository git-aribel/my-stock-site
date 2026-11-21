import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasDownloadAccess } from "@/lib/access";
import { ASSISTANT_SKILLS } from "@/lib/assistant";
import AssistantChat from "@/components/tools/AssistantChat";

export const metadata: Metadata = {
  title: "AI Content Assistant | Socials Bestie",
  description:
    "A members-only AI assistant for captions, hooks, content calendars, library picks and profile tips.",
};

// Members get the chat. Everyone else sees what they'd unlock.
async function AssistantGate() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && (await hasDownloadAccess(supabase, user.id))) {
    // The chat switches on once the Anthropic API key is added
    return process.env.ANTHROPIC_API_KEY ? <AssistantChat /> : <ComingSoon />;
  }

  return <Teaser loggedIn={!!user} />;
}

function ComingSoon() {
  return (
    <div className="mx-auto max-w-2xl border border-cocoa/25 bg-paper p-8 text-center md:p-12">
      <span className="bg-periwinkle px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
        Coming soon
      </span>
      <h2 className="mt-5 font-script text-5xl text-denim">Almost ready, bestie!</h2>
      <p className="mt-4 font-serif text-xl leading-relaxed text-ink/80">
        Your AI assistant is getting its final touches. Soon you&apos;ll be able
        to ask for captions, content calendars, picks from the library and
        profile tips, all in your brand voice. It&apos;s included in your
        membership.
      </p>
      <Link
        href="/tools"
        className="mt-8 inline-block border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
      >
        Explore the free tools
      </Link>
    </div>
  );
}

function Teaser({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="space-y-14">
      <div className="grid gap-6 md:grid-cols-2">
        {ASSISTANT_SKILLS.map((s, i) => (
          <div key={s.title} className="border border-cocoa/25 bg-paper p-7">
            <p className="font-serif text-3xl text-rose-deep">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-script text-4xl text-denim">{s.title}</h2>
            <p className="mt-3 font-serif text-lg leading-relaxed text-ink/80">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Locked preview of the chat */}
      <div className="relative mx-auto max-w-3xl overflow-hidden border border-cocoa/25 bg-paper">
        <div aria-hidden="true" className="space-y-4 p-6 blur-[2px] select-none md:p-8">
          <p className="ml-auto max-w-[80%] bg-periwinkle px-4 py-3 font-serif text-lg text-cocoa">
            Plan a week of posts for my candle shop, cozy and minimal vibe 🕯️
          </p>
          <div className="max-w-[90%] space-y-2 bg-cream px-4 py-3 font-serif text-lg text-ink">
            <p><strong>Mon:</strong> Reel of a candle being lit, hook: &ldquo;the 5pm ritual you didn&apos;t know you needed&rdquo;</p>
            <p><strong>Wed:</strong> Carousel, &ldquo;3 scents for 3 moods&rdquo;</p>
            <p><strong>Fri:</strong> Behind the scenes of pouring a new batch</p>
            <p className="text-base text-cocoa/70">Library picks: 4 cozy videos and the Minimal Carousel templates.</p>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream/70 p-6 text-center">
          <span className="bg-cocoa px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-periwinkle">
            Members only
          </span>
          <p className="mt-4 max-w-md font-serif text-2xl text-ink">
            Join the club to unlock your assistant, plus unlimited downloads of
            every video, template and image.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              className="bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
            >
              Join the club
            </Link>
            {!loggedIn && (
              <Link
                href="/login?next=/tools/assistant"
                className="border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
              >
                Member? Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Creator Hub · Members
          </p>
          <h1 className="mt-4 font-script text-6xl text-periwinkle md:text-8xl">
            Your AI assistant
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Captions, hooks, content calendars, picks from our library and
            honest profile feedback, all in your brand voice.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <Suspense
          fallback={<p className="text-center font-serif text-lg text-cocoa/70">Loading...</p>}
        >
          <AssistantGate />
        </Suspense>
      </section>

      <section className="border-t border-cocoa/15 py-10 text-center">
        <Link
          href="/tools"
          className="text-[0.7rem] uppercase tracking-[0.25em] text-cocoa hover:text-denim"
        >
          ← Creator Hub
        </Link>
      </section>
    </div>
  );
}
