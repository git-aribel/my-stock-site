"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";

export default function AffiliateApplyForm({
  defaultEmail,
}: {
  defaultEmail: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [payoutEmail, setPayoutEmail] = useState(defaultEmail);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/affiliates/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, payoutEmail, agree }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="code" className={labelClass}>
          Your code
        </label>
        <input
          id="code"
          required
          value={code}
          onChange={(e) =>
            setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
          }
          maxLength={24}
          placeholder="yourname"
          className={inputClass}
        />
        <p className="font-serif text-base text-cocoa/60">
          Your link will end in /?ref={code || "yourname"}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="payout" className={labelClass}>
          PayPal email for payouts
        </label>
        <input
          id="payout"
          type="email"
          required
          value={payoutEmail}
          onChange={(e) => setPayoutEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <label className="flex items-start gap-3 font-serif text-lg text-ink/80">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1.5 accent-cocoa"
        />
        <span>
          I agree to the{" "}
          <Link href="/affiliate-terms" className="underline hover:text-denim">
            Affiliate Terms
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting || !agree}
        className="w-full bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
      >
        {submitting ? "One moment..." : "Apply"}
      </button>
      {error && <p className="font-serif text-base text-red-800">{error}</p>}
    </form>
  );
}
