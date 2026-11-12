"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { selected_plan: plan } },
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/pricing");
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <div className="text-center">
        <h2 className="font-script text-5xl text-denim">Check your email</h2>
        <p className="mt-4 font-serif text-xl text-cocoa/80">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then log in.
        </p>
      </div>
    );
  }

  return (
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
          Password (min. 8 characters)
        </label>
        <input
          type="password"
          required
          minLength={8}
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
        {submitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center font-serif text-lg text-cocoa/80">
        Already a member?{" "}
        <Link href="/login" className="text-denim underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="font-script text-7xl text-periwinkle md:text-8xl">
            Create account
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-14">
        <div className="border border-cocoa/25 bg-paper p-8">
          <Suspense fallback={null}>
            <SignupForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}