import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AffiliateApplyForm from "@/components/AffiliateApplyForm";
import CopyLinkButton from "@/components/CopyLinkButton";
import {
  COOKIE_DAYS,
  HOLD_DAYS,
  MIN_PAYOUT_CENTS,
  formatMoney,
  holdCutoff,
} from "@/lib/affiliates";

const label = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/60";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Commission = {
  id: string;
  amount_paid: number;
  commission: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
};

async function AffiliatePanel() {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-center">
        <p className="font-serif text-xl text-ink/80">
          Create a free account or log in to apply. You don&apos;t need a
          membership to join.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup?next=/affiliates/join"
            className="bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
          >
            Sign up
          </Link>
          <Link
            href="/login?next=/affiliates/join"
            className="border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("id, code, payout_email, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!affiliate) {
    return (
      <div>
        <h2 className="mb-6 text-center font-script text-5xl text-denim">
          Apply
        </h2>
        <AffiliateApplyForm defaultEmail={user.email ?? ""} />
      </div>
    );
  }

  if (affiliate.status === "pending") {
    return (
      <div className="text-center">
        <h2 className="font-script text-5xl text-denim">Thank you!</h2>
        <p className="mt-4 font-serif text-xl text-ink/80">
          Your application for the code <strong>{affiliate.code}</strong> is
          being reviewed. We usually reply within a few days.
        </p>
      </div>
    );
  }

  if (affiliate.status !== "approved") {
    return (
      <div className="text-center">
        <p className="font-serif text-xl text-ink/80">
          Your affiliate account is not active. If you think this is a
          mistake, please <Link href="/contact" className="underline">contact us</Link>.
        </p>
      </div>
    );
  }

  const { data } = await supabase
    .from("affiliate_commissions")
    .select("id, amount_paid, commission, currency, status, created_at, paid_at")
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false });
  const commissions = (data as Commission[]) ?? [];

  const holdUntil = holdCutoff();
  const currency = commissions[0]?.currency ?? "usd";
  let onHold = 0;
  let ready = 0;
  let paid = 0;
  for (const c of commissions) {
    if (c.status === "paid") paid += c.commission;
    else if (c.status === "pending") {
      if (new Date(c.created_at).getTime() < holdUntil) ready += c.commission;
      else onHold += c.commission;
    }
  }
  const sales = commissions.filter((c) => c.status !== "void").length;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const link = `${proto}://${host}/?ref=${affiliate.code}`;

  return (
    <div className="space-y-10">
      <div>
        <p className={label}>Your link</p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <code className="break-all border border-cocoa/25 bg-cream px-3 py-2 font-mono text-base text-cocoa">
            {link}
          </code>
          <CopyLinkButton link={link} />
        </div>
        <p className="mt-2 font-serif text-base text-cocoa/60">
          You can add ?ref={affiliate.code} to any page, like /pricing?ref=
          {affiliate.code}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { k: "Payments", v: String(sales) },
          { k: "On hold", v: formatMoney(onHold, currency) },
          { k: "Ready to pay", v: formatMoney(ready, currency) },
          { k: "Paid out", v: formatMoney(paid, currency) },
        ].map((s) => (
          <div key={s.k}>
            <p className={label}>{s.k}</p>
            <p className="mt-1 font-serif text-2xl text-ink">{s.v}</p>
          </div>
        ))}
      </div>

      <div>
        <p className={label}>History</p>
        {commissions.length === 0 ? (
          <p className="mt-2 font-serif text-lg text-cocoa/70">
            No referrals yet. Share your link to get started.
          </p>
        ) : (
          <table className="mt-3 w-full font-serif text-lg text-ink/85">
            <thead>
              <tr className="text-left text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                <th className="pb-2 font-normal">Date</th>
                <th className="pb-2 font-normal">Payment</th>
                <th className="pb-2 font-normal">You earn</th>
                <th className="pb-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-t border-cocoa/15">
                  <td className="py-2">{formatDate(c.created_at)}</td>
                  <td className="py-2">{formatMoney(c.amount_paid, c.currency)}</td>
                  <td className="py-2">{formatMoney(c.commission, c.currency)}</td>
                  <td className="py-2 capitalize">
                    {c.status === "void" ? "Refunded" : c.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="font-serif text-base text-cocoa/60">
        Payouts go to {affiliate.payout_email} by PayPal at the start of each
        month, once you have at least {formatMoney(MIN_PAYOUT_CENTS, currency)}{" "}
        ready to pay. To change your payout email,{" "}
        <Link href="/contact" className="underline">contact us</Link>.
      </p>
    </div>
  );
}

export default function AffiliateJoinPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Affiliate program
          </p>
          <h1 className="mt-3 font-script text-7xl text-periwinkle md:text-8xl">
            Your affiliate account
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14">
        <div className="border border-cocoa/25 bg-paper p-8">
          <Suspense
            fallback={
              <p className="font-serif text-lg text-cocoa/70">Loading...</p>
            }
          >
            <AffiliatePanel />
          </Suspense>
        </div>
        <p className="mt-6 text-center font-serif text-base text-cocoa/60">
          Referrals are tracked for {COOKIE_DAYS} days. Commissions are held{" "}
          {HOLD_DAYS} days in case of refunds. See the{" "}
          <Link href="/affiliate-terms" className="underline">
            Affiliate Terms
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
