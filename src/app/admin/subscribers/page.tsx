import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SubscribersExport from "@/components/SubscribersExport";
import { setUnsubscribed } from "./actions";

type Subscriber = {
  id: string;
  email: string;
  source: string;
  consented_at: string;
  unsubscribed_at: string | null;
  promo_code: string | null;
};

const smallBtn =
  "border border-cocoa/30 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa transition hover:bg-rose/40";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function SubscribersAdmin() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const { data, error } = await createAdminClient()
    .from("email_subscribers")
    .select("id, email, source, consented_at, unsubscribed_at, promo_code")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="font-serif text-lg text-red-800">
        Couldn&apos;t load subscribers. Did you run supabase/free_pack.sql?
      </p>
    );
  }

  const all = (data as Subscriber[]) ?? [];
  const active = all.filter((s) => !s.unsubscribed_at);
  const last30 = active.filter((s) => Date.parse(s.consented_at) > Date.parse(new Date().toISOString()) - 30 * 864e5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex gap-10">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/60">Subscribed</p>
            <p className="font-serif text-4xl text-ink">{active.length}</p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/60">Last 30 days</p>
            <p className="font-serif text-4xl text-ink">{last30.length}</p>
          </div>
        </div>
        <SubscribersExport
          rows={active.map(({ email, source, consented_at, promo_code }) => ({ email, source, consented_at, code: promo_code ?? "" }))}
        />
      </div>

      <p className="font-serif text-base text-cocoa/70">
        Everyone here agreed to receive emails when they got the 15% welcome offer. When
        you set up an email service (like MailerLite or Resend), import this CSV.
        If someone asks to be removed, click Unsubscribe.
      </p>

      {all.length === 0 ? (
        <p className="font-serif text-lg text-cocoa/70">No signups yet.</p>
      ) : (
        <table className="w-full font-serif text-lg text-ink/85">
          <thead>
            <tr className="text-left text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
              <th className="pb-2 font-normal">Email</th>
              <th className="hidden pb-2 font-normal sm:table-cell">Code</th>
              <th className="hidden pb-2 font-normal sm:table-cell">Signed up</th>
              <th className="pb-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {all.map((s) => (
              <tr key={s.id} className={`border-t border-cocoa/15 ${s.unsubscribed_at ? "opacity-50" : ""}`}>
                <td className="break-all py-2 pr-3">
                  {s.email}
                  {s.unsubscribed_at && <span className="ml-2 text-sm">(unsubscribed)</span>}
                </td>
                <td className="hidden py-2 font-mono text-sm sm:table-cell">{s.promo_code ?? "—"}</td>
                <td className="hidden py-2 sm:table-cell">{fmt(s.consented_at)}</td>
                <td className="py-2 text-right">
                  <form action={setUnsubscribed}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="unsubscribe" value={s.unsubscribed_at ? "0" : "1"} />
                    <button className={smallBtn}>{s.unsubscribed_at ? "Resubscribe" : "Unsubscribe"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AdminSubscribersPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">Admin</p>
          <h1 className="mt-3 font-script text-7xl text-periwinkle md:text-8xl">Email list</h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Suspense fallback={<p className="font-serif text-lg text-cocoa/70">Loading...</p>}>
          <SubscribersAdmin />
        </Suspense>
      </section>
    </div>
  );
}
