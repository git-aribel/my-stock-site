"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Parisienne } from "next/font/google";

// Elegant handwriting for the letter
const hand = Parisienne({ subsets: ["latin"], weight: "400" });

// The lace envelope photo comes in two versions (all images 707 x 795, in
// /public/letter):
//  - closed: envelope-closed-body + envelope-closed-flap (the flower flap
//    from the front, flipped to fold down over the letter)
//  - open: envelope-back + envelope-letter (handwriting removed) +
//    envelope-front, which is the original photo
// The closed flap's top edge sits at 292 / 795 = 36.7% from the top.

type Stage = "closed" | "opening" | "open";

// The 15% welcome offer as a letter: a notification pops up, the closed
// envelope wiggles, and tapping it folds the flap up, opens the envelope
// and writes the message on the letter.
export default function WelcomeLetter({ percent }: { percent: number }) {
  const [stage, setStage] = useState<Stage>("closed");
  const layer = "pointer-events-none absolute inset-0 h-full w-full select-none";
  const isOpen = stage === "open";

  useEffect(() => {
    if (stage !== "opening") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setStage("open"), reduce ? 0 : 480);
    return () => window.clearTimeout(t);
  }, [stage]);

  const open = () => stage === "closed" && setStage("opening");

  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div
        className={`letter-envelope relative aspect-[707/795] w-full ${stage === "closed" ? "cursor-pointer" : ""}`}
        onClick={open}
      >
        {/* Open envelope (the original photo, in layers) */}
        <div className={`letter-open absolute inset-0 ${isOpen ? "opacity-100" : "opacity-0"}`} aria-hidden={!isOpen}>
          <Image src="/letter/envelope-back.webp" alt="" width={707} height={795} className={layer} />
          <Image src="/letter/envelope-letter.webp" alt="" width={707} height={795} className={layer} />
          <div
            // The paper in the photo is tilted ~2.7° clockwise, so the writing is too
            className={`absolute left-[19%] right-[19%] top-[12.5%] rotate-[2.7deg] sm:top-[18%] text-center text-ink ${hand.className} ${
              isOpen ? "letter-written" : "letter-blank"
            }`}
          >
            <p className="text-[clamp(1.45rem,6vw,1.95rem)] leading-none">Dear bestie,</p>
            <p className="mt-2 text-[clamp(1rem,4vw,1.25rem)] leading-snug text-ink/85">
              Here&apos;s <span className="text-[#9a6a64]">{percent}% off</span> your first membership, on any plan.
              Welcome to the club!
            </p>
            <p className="mt-1.5 text-[clamp(1rem,4vw,1.25rem)] leading-snug text-ink/85">Love, your Socials Bestie ♡</p>
            <Link
              href="/welcome-offer"
              tabIndex={isOpen ? 0 : -1}
              className="mt-3 inline-block rounded-full bg-cocoa px-5 py-2 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
            >
              Get my {percent}% off
            </Link>
          </div>
          <Image src="/letter/envelope-front.webp" alt="" width={707} height={795} className={layer} />
        </div>

        {/* Closed envelope */}
        <div className={`letter-closed pointer-events-none absolute inset-0 ${isOpen ? "opacity-0" : "opacity-100"}`} aria-hidden={isOpen}>
          <Image src="/letter/envelope-closed-body.webp" alt="" width={707} height={795} className={layer} priority={false} />
          <Image
            src="/letter/envelope-closed-flap.webp"
            alt=""
            width={707}
            height={795}
            className={`letter-flap ${layer} ${stage === "closed" ? "" : "letter-flap-up"}`}
          />
        </div>

        {/* Notification, floating above the closed envelope */}
        <button
          type="button"
          onClick={open}
          aria-hidden={stage !== "closed"}
          tabIndex={stage === "closed" ? 0 : -1}
          className={`letter-notice absolute inset-x-0 top-[12%] mx-auto flex w-fit items-center gap-3 rounded-full border border-cocoa/15 bg-paper py-2.5 pl-3 pr-5 text-left shadow-[0_12px_30px_-16px_rgba(74,47,39,0.55)] transition duration-500 ${
            stage === "closed" ? "" : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cocoa text-periwinkle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            <span className="letter-ping absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-rose-deep ring-2 ring-paper" />
          </span>
          <span>
            <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-rose-deep">You&apos;ve got mail</span>
            <span className="block font-serif text-base text-ink">1 new letter from Socials Bestie</span>
          </span>
        </button>

        {stage === "closed" && (
          <button
            type="button"
            onClick={open}
            className="absolute inset-x-0 bottom-[10%] mx-auto w-fit rounded-full bg-paper/90 px-5 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa shadow transition hover:bg-paper"
          >
            Open your letter
          </button>
        )}
      </div>

      {/* Screen readers get the offer straight away */}
      <p className="sr-only">
        Welcome offer: {percent}% off your first membership payment when you join our email list.
      </p>
    </div>
  );
}
