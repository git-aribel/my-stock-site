import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getService } from "@/lib/services";
import { setInquiryStatus } from "./actions";

type Inquiry = {
  id: string;
  service: string;
  name: string;
  email: string;
  business: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  details: Record<string, string | string[]>;
  status: string;
  created_at: string;
};

const smallBtn =
  "border border-cocoa/30 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa transition hover:bg-rose/40";
const label = "text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60";

function StatusButton({ id, status, text }: { id: string; status: string; text: string }) {
  return (
    <form action={setInquiryStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={smallBtn}>{text}</button>
    </form>
  );
}

async function InquiriesAdmin() {
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

  const { data, error } = await createAdminClient()
    .from("service_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <p className="font-serif text-lg text-red-800">
        Couldn&apos;t load inquiries. Did you run supabase/service_inquiries.sql?
      </p>
    );
  }

  const inquiries = (data as Inquiry[]) ?? [];
  const groups = [
    { key: "new", title: "New" },
    { key: "replied", title: "Replied" },
    { key: "closed", title: "Closed" },
  ];

  return (
    <div className="space-y-14">
      {groups.map((g) => {
        const list = inquiries.filter((q) => q.status === g.key);
        return (
          <div key={g.key}>
            <h2 className="font-script text-5xl text-denim">
              {g.title} <span className="font-serif text-2xl text-cocoa/50">({list.length})</span>
            </h2>
            {list.length === 0 ? (
              <p className="mt-3 font-serif text-lg text-cocoa/70">None.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {list.map((q) => {
                  const service = getService(q.service);
                  return (
                    <details key={q.id} open={g.key === "new"} className="border border-cocoa/25 bg-paper p-5">
                      <summary className="flex cursor-pointer flex-wrap items-baseline justify-between gap-2 font-serif text-lg text-ink">
                        <span>
                          <strong>{q.name}</strong>
                          {q.business && ` · ${q.business}`} · {service?.name ?? q.service}
                        </span>
                        <span className="text-base text-cocoa/60">
                          {new Date(q.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </summary>

                      <div className="mt-4 grid gap-4 font-serif text-lg text-ink/85 sm:grid-cols-3">
                        <div>
                          <p className={label}>Email</p>
                          <a href={`mailto:${q.email}`} className="break-all underline hover:text-denim">
                            {q.email}
                          </a>
                        </div>
                        <div>
                          <p className={label}>Budget</p>
                          <p>{q.budget ?? "—"}</p>
                        </div>
                        <div>
                          <p className={label}>Start</p>
                          <p>{q.timeline ?? "—"}</p>
                        </div>
                        {service?.fields.map((f) =>
                          q.details?.[f.name] ? (
                            <div key={f.name}>
                              <p className={label}>{f.label}</p>
                              <p>
                                {Array.isArray(q.details[f.name])
                                  ? (q.details[f.name] as string[]).join(", ")
                                  : (q.details[f.name] as string)}
                              </p>
                            </div>
                          ) : null,
                        )}
                      </div>

                      <div className="mt-4">
                        <p className={label}>Project</p>
                        <p className="mt-1 whitespace-pre-line font-serif text-lg text-ink/85">{q.message}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <a
                          href={`mailto:${q.email}?subject=${encodeURIComponent(`Your ${service?.name ?? "service"} inquiry`)}`}
                          className="bg-cocoa px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-periwinkle transition hover:bg-cocoa-deep"
                        >
                          Reply by email
                        </a>
                        {q.status !== "replied" && <StatusButton id={q.id} status="replied" text="Mark replied" />}
                        {q.status !== "closed" && <StatusButton id={q.id} status="closed" text="Close" />}
                        {q.status !== "new" && <StatusButton id={q.id} status="new" text="Move to new" />}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Admin
          </p>
          <h1 className="mt-3 font-script text-7xl text-periwinkle md:text-8xl">
            Inquiries
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <Suspense fallback={<p className="font-serif text-lg text-cocoa/70">Loading...</p>}>
          <InquiriesAdmin />
        </Suspense>
      </section>
    </div>
  );
}
