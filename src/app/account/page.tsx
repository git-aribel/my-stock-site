import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ManageBillingButton from "@/components/ManageBillingButton";

const PLAN_NAMES: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "3 Months",
  annual: "Annual",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function AccountDetails() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end, cancel_at_period_end")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stillValid =
    !sub?.current_period_end ||
    new Date(sub.current_period_end).getTime() > Date.now();
  const isActive =
    !!sub && ["active", "trialing"].includes(sub.status ?? "") && stillValid;

  const planName = sub?.plan ? (PLAN_NAMES[sub.plan] ?? sub.plan) : "Member";

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/60">
          Email
        </p>
        <p className="mt-1 font-serif text-xl text-ink">{user.email}</p>
      </div>

      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/60">
          Membership
        </p>

        {isActive && sub ? (
          <div className="mt-1 space-y-1 font-serif text-xl text-ink">
            <p>{planName} plan · Active</p>
            {sub.current_period_end && (
              <p className="text-cocoa/80">
                {sub.cancel_at_period_end
                  ? `Cancelled. You keep access until ${formatDate(sub.current_period_end)}.`
                  : `Renews on ${formatDate(sub.current_period_end)}.`}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-1 font-serif text-xl text-ink">
            <p>
              {sub
                ? "Your membership is not active."
                : "You don't have a membership yet."}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-4">
        {sub ? (
          <ManageBillingButton />
        ) : (
          <Link
            href="/pricing"
            className="bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
          >
            Join the club
          </Link>
        )}

        {!isActive && sub && (
          <Link
            href="/pricing"
            className="border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
          >
            Choose a plan
          </Link>
        )}
        {profile?.is_admin && (
          <>
            <Link
              href="/admin"
              className="border border-denim px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-denim transition hover:bg-mist-deep/20"
            >
              Admin: manage
            </Link>
            <Link
              href="/admin/collections"
              className="border border-denim px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-denim transition hover:bg-mist-deep/20"
            >
              Admin: collections
            </Link>
            <Link
              href="/admin/affiliates"
              className="border border-denim px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-denim transition hover:bg-mist-deep/20"
            >
              Admin: affiliates
            </Link>
            <Link
              href="/admin/upload"
              className="border border-denim px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-denim transition hover:bg-mist-deep/20"
            >
              Admin: upload
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="font-script text-7xl text-periwinkle md:text-8xl">
            Your account
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-14">
        <div className="border border-cocoa/25 bg-paper p-8">
          <Suspense
            fallback={
              <p className="font-serif text-lg text-cocoa/70">Loading...</p>
            }
          >
            <AccountDetails />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
