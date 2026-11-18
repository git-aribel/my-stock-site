"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-9 w-40" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.25em]">
        <Link
          href="/account"
          className="hidden max-w-[10rem] truncate font-light text-cocoa/70 hover:text-denim sm:block"
        >
          Account
        </Link>
        <button
          onClick={handleLogout}
          className="bg-cocoa px-5 py-2.5 text-periwinkle transition hover:bg-cocoa-deep"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.25em]">
      <Link
        href="/login"
        className="hidden font-light text-cocoa hover:text-denim sm:block"
      >
        Log in
      </Link>
      <Link
        href="/pricing"
        className="bg-cocoa px-5 py-2.5 text-periwinkle transition hover:bg-cocoa-deep"
      >
        Join now
      </Link>
    </div>
  );
}
