"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Email signup for the welcome offer
export function WelcomeOfferForm({ consentText }: { consentText: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const website = new FormData(e.currentTarget).get("website");
    try {
      const res = await fetch("/api/welcome-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        autoComplete="email"
        aria-label="Your email"
        className="w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim"
      />
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <label className="flex items-start gap-3 text-left font-serif text-base text-ink/80">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-1 accent-cocoa"
        />
        <span>
          {consentText} See our{" "}
          <Link href="/privacy" className="underline hover:text-denim">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <button
        type="submit"
        disabled={busy || !consent}
        className="w-full bg-cocoa px-6 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
      >
        {busy ? "One moment..." : "Get my code"}
      </button>
      {error && <p className="font-serif text-base text-red-800">{error}</p>}
    </form>
  );
}

// The code, with a copy button
export function CodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="stamp px-6 py-3 font-mono text-2xl tracking-[0.15em] text-cocoa">{code}</span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {}
        }}
        className="border border-cocoa px-4 py-3 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
