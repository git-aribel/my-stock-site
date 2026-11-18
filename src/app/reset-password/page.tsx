"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "ready" | "invalid">(
    "checking"
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setState("ready");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setState("ready");
    });

    const timer = setTimeout(() => {
      setState((s) => (s === "checking" ? "invalid" : s));
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("The passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error } = await createClient().auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
  }

  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="font-script text-7xl text-periwinkle md:text-8xl">
            New password
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-14">
        <div className="border border-cocoa/25 bg-paper p-8">
          {state === "checking" && (
            <p className="text-center font-serif text-xl text-cocoa/70">
              Checking your link...
            </p>
          )}

          {state === "invalid" && (
            <div className="text-center">
              <p className="font-serif text-xl text-cocoa/80">
                This reset link is invalid or has expired. Make sure you opened
                it in the same browser you requested it from.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block text-denim underline"
              >
                Request a new link
              </Link>
            </div>
          )}

          {state === "ready" && done && (
            <div className="text-center">
              <h2 className="font-script text-5xl text-denim">All set</h2>
              <p className="mt-4 font-serif text-xl text-cocoa/80">
                Your password has been updated. Taking you home...
              </p>
            </div>
          )}

          {state === "ready" && !done && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
                  New password (min. 8 characters)
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

              <div>
                <label className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim"
                />
              </div>

              {error && <p className="font-serif text-lg text-red-800">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save new password"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}