"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="font-script text-7xl text-periwinkle md:text-8xl">
            Welcome back
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-14">
        <div className="border border-cocoa/25 bg-paper p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim"
              />
            </div>

            {error && <p className="font-serif text-lg text-red-800">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>

            <p className="text-center font-serif text-lg text-cocoa/80">
              New here?{" "}
              <Link href="/pricing" className="text-denim underline">
                Join the club
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}