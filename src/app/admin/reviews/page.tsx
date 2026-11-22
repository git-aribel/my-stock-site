import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { REVIEW_COLUMNS, type Review } from "@/lib/reviews";
import { Stars } from "@/components/ReviewCard";
import { removeReview, setReviewStatus } from "./actions";

export const metadata: Metadata = { title: "Reviews", robots: { index: false, follow: false } };

const smallBtn =
  "border border-cocoa/30 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa transition hover:bg-rose/40";

function StatusButton({ id, status, text, primary }: { id: string; status: string; text: string; primary?: boolean }) {
  return (
    <form action={setReviewStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        className={
          primary
            ? "bg-cocoa px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-periwinkle transition hover:bg-cocoa-deep"
            : smallBtn
        }
      >
        {text}
      </button>
    </form>
  );
}

async function ReviewsAdmin() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const { data, error } = await createAdminClient()
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    return (
      <p className="font-serif text-lg text-red-800">
        Couldn&apos;t load reviews. Did you run supabase/reviews.sql?
      </p>
    );
  }

  const reviews = (data as Review[]) ?? [];
  const groups = [
    { key: "pending", title: "Waiting for approval" },
    { key: "approved", title: "Live on the site" },
    { key: "hidden", title: "Hidden" },
  ] as const;

  return (
    <div className="space-y-14">
      {groups.map((g) => {
        const list = reviews.filter((r) => r.status === g.key);
        return (
          <div key={g.key}>
            <h2 className="font-script text-5xl text-denim">
              {g.title} <span className="font-serif text-2xl text-cocoa/50">({list.length})</span>
            </h2>
            {list.length === 0 ? (
              <p className="mt-3 font-serif text-lg text-cocoa/70">None.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {list.map((r) => (
                  <div key={r.id} className="border border-cocoa/25 bg-paper p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-serif text-lg text-ink">
                        <strong>{r.name}</strong>
                        {r.role && ` · ${r.role}`}
                      </p>
                      <span className="font-serif text-base text-cocoa/60">
                        {new Date(r.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <Stars rating={r.rating} className="mt-2" />
                    <p className="mt-3 whitespace-pre-line font-serif text-lg text-ink/85">{r.body}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {r.status !== "approved" && <StatusButton id={r.id} status="approved" text="Approve" primary />}
                      {r.status !== "hidden" && <StatusButton id={r.id} status="hidden" text="Hide" />}
                      {r.status !== "pending" && <StatusButton id={r.id} status="pending" text="Back to waiting" />}
                      <form action={removeReview}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className={`${smallBtn} text-red-800`}>Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">Admin</p>
          <h1 className="mt-3 font-script text-7xl text-periwinkle md:text-8xl">Reviews</h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <Suspense fallback={<p className="font-serif text-lg text-cocoa/70">Loading...</p>}>
          <ReviewsAdmin />
        </Suspense>
      </section>
    </div>
  );
}
