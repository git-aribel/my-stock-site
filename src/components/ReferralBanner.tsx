"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Shows when someone arrives with ?ref=code. The sb_ref cookie is only
// saved if they accept, as the privacy policy promises.
const DISMISSED_KEY = "sb_ref_answered";

export default function ReferralBanner() {
  const [code, setCode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref")?.trim().toLowerCase();
    if (!ref) return;

    // Remove ?ref from the address bar so it isn't shared further by accident
    params.delete("ref");
    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash,
    );

    let answered: string | null = null;
    try {
      answered = localStorage.getItem(DISMISSED_KEY);
    } catch {}
    // Ask again only if they come in through a different partner's link
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (answered !== ref) setCode(ref);
  }, []);

  if (!code) return null;

  function remember() {
    try {
      localStorage.setItem(DISMISSED_KEY, code!);
    } catch {}
  }

  async function accept() {
    setSaving(true);
    await fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => {});
    remember();
    setCode(null);
  }

  function decline() {
    remember();
    setCode(null);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 border border-cocoa/25 bg-paper p-5 shadow-lg md:flex-row md:items-center">
        <p className="flex-1 font-serif text-lg leading-snug text-ink/85">
          A partner sent you here. Can we save a small cookie for 60 days so
          they get credit if you join?{" "}
          <Link href="/privacy" className="underline hover:text-denim">
            Privacy
          </Link>
        </p>
        <div className="flex gap-3">
          <button
            onClick={decline}
            className="border border-cocoa px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
          >
            No thanks
          </button>
          <button
            onClick={accept}
            disabled={saving}
            className="bg-cocoa px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
