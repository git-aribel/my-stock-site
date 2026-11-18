"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="font-script text-7xl text-periwinkle md:text-8xl">
            Reset password
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-14">
        <div className="border border-cocoa/25 bg-paper p-8">
          {sent ? (
            <div className="text-center">
              <h2 className="font-script text-5xl text-denim">Check your email</h2>
              <p className="mt-4 font-serif text-xl text-cocoa/80">
                If an account exists for <strong>{email}</strong>, we sent a
                link to choose a new password. Open it in this same browser.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="font-serif text-lg text-cocoa/80">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </p>

              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim"
                />
              </div>

              {error && <p className="font-serif text-lg text-red-800">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send reset link"}
              </button>

              <p className="text-center font-serif text-lg text-cocoa/80">
                <Link href="/login" className="text-denim underline">
                  Back to log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}