import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  HOLD_DAYS,
  MIN_PAYOUT_CENTS,
  formatMoney,
  holdCutoff,
} from "@/lib/affiliates";
import { markPaid, setAffiliateStatus } from "./actions";

const smallBtn =
  "border border-cocoa/30 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa transition hover:bg-rose/40";
const label = "text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60";

type Affiliate = {
  id: string;
  code: string;
  payout_email: string;
  status: string;
  created_at: string;
};

type Commission = {
  affiliate_id: string;
  commission: number;
  currency: string;
  status: string;
  created_at: string;
};

function StatusButton({
  id,
  status,
  text,
}: {
  id: string;
  status: string;
  text: string;
}) {
  return (
    <form action={setAffiliateStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={smallBtn}>{text}</button>
    </form>
  );
}

async function AffiliatesAdmin() {
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
  if (!profile?.is_admin) redirect("/");

  const admin = createAdminClient();
  const [{ data: affData }, { data: comData }] = await Promise.all([
    admin
      .from("affiliates")
      .select("id, code, payout_email, status, created_at")
      .order("created_at", { ascending: false }),
    admin
      .from("affiliate_commissions")
      .select("affiliate_id, commission, currency, status, created_at")
      .neq("status", "void"),
  ]);
  const affiliates = (affData as Affiliate[]) ?? [];
  const commissions = (comData as Commission[]) ?? [];

  const cutoff = holdCutoff();
  const totals = new Map<
    string,
    { sales: number; onHold: number; ready: number; paid: number; currency: string }
  >();
  for (const c of commissions) {
    const t = totals.get(c.affiliate_id) ?? {
      sales: 0,
      onHold: 0,
      ready: 0,
      paid: 0,
      currency: c.currency,
    };
    t.sales += 1;
    if (c.status === "paid") t.paid += c.commission;
    else if (new Date(c.created_at).getTime() < cutoff) t.ready += c.commission;
    else t.onHold += c.commission;
    totals.set(c.affiliate_id, t);
  }

  const pending = affiliates.filter((a) => a.status === "pending");
  const others = affiliates.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-script text-5xl text-denim">Applications</h2>
        {pending.length === 0 ? (
          <p className="mt-3 font-serif text-lg text-cocoa/70">
            No new applications.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 border border-cocoa/25 bg-paper p-4"
              >
                <div className="font-serif text-lg text-ink">
                  <p>
                    <strong>{a.code}</strong> · {a.payout_email}
                  </p>
                  <p className="text-base text-cocoa/60">
                    Applied {new Date(a.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusButton id={a.id} status="approved" text="Approve" />
                  <StatusButton id={a.id} status="rejected" text="Reject" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-script text-5xl text-denim">Affiliates</h2>
        <p className="mt-2 font-serif text-base text-cocoa/60">
          &quot;Ready&quot; is past the {HOLD_DAYS}-day refund hold. Send the
          payout by PayPal, then click Mark paid. Minimum payout is{" "}
          {formatMoney(MIN_PAYOUT_CENTS)}.
        </p>
        {others.length === 0 ? (
          <p className="mt-3 font-serif text-lg text-cocoa/70">None yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {others.map((a) => {
              const t = totals.get(a.id);
              const cur = t?.currency ?? "usd";
              const canPay = (t?.ready ?? 0) >= MIN_PAYOUT_CENTS;
              return (
                <div
                  key={a.id}
                  className="border border-cocoa/25 bg-paper p-4 font-serif text-lg text-ink"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p>
                      <strong>{a.code}</strong> · {a.payout_email} ·{" "}
                      <span className="capitalize">{a.status}</span>
                    </p>
                    <div className="flex gap-2">
                      {a.status === "approved" ? (
                        <StatusButton id={a.id} status="suspended" text="Suspend" />
                      ) : (
                        <StatusButton id={a.id} status="approved" text="Approve" />
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-5 md:items-end">
                    <div>
                      <p className={label}>Payments</p>
                      <p>{t?.sales ?? 0}</p>
                    </div>
                    <div>
                      <p className={label}>On hold</p>
                      <p>{formatMoney(t?.onHold ?? 0, cur)}</p>
                    </div>
                    <div>
                      <p className={label}>Ready</p>
                      <p>{formatMoney(t?.ready ?? 0, cur)}</p>
                    </div>
                    <div>
                      <p className={label}>Paid</p>
                      <p>{formatMoney(t?.paid ?? 0, cur)}</p>
                    </div>
                    {(t?.ready ?? 0) > 0 && (
                      <form action={markPaid}>
                        <input type="hidden" name="affiliateId" value={a.id} />
                        <button
                          className={`${smallBtn} ${canPay ? "" : "opacity-60"}`}
                          title={canPay ? undefined : "Below the minimum payout"}
                        >
                          Mark paid
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAffiliatesPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Admin
          </p>
          <h1 className="mt-3 font-script text-7xl text-periwinkle md:text-8xl">
            Affiliates
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <Suspense
          fallback={
            <p className="font-serif text-lg text-cocoa/70">Loading...</p>
          }
        >
          <AffiliatesAdmin />
        </Suspense>
      </section>
    </div>
  );
}
