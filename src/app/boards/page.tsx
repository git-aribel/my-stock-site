import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasDownloadAccess } from "@/lib/access";
import { publicPreviewUrl } from "@/lib/library";
import { NewBoardForm } from "@/components/BoardControls";

export const metadata: Metadata = { title: "My boards", robots: { index: false, follow: false } };

function MembersOnly({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="mx-auto max-w-xl border border-cocoa/25 bg-paper p-8 text-center">
      <span className="bg-periwinkle px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">Members only</span>
      <p className="mt-5 font-serif text-xl leading-relaxed text-ink/80">
        Save your favourite videos, templates and images into boards like
        “Spring launch” or “Client X”, and download them whenever you need.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/pricing" className="bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep">
          Join the club
        </Link>
        {!loggedIn && (
          <Link href="/login?next=/boards" className="border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40">
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}

async function Boards() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !(await hasDownloadAccess(supabase, user.id))) {
    return <MembersOnly loggedIn={!!user} />;
  }

  const { data: boards } = await supabase
    .from("boards")
    .select("id, name, board_items(created_at, content_items(preview_path))")
    .order("created_at");

  const cards = (boards ?? []).map((b) => {
    const items = [...(b.board_items ?? [])].sort((x, y) => (x.created_at < y.created_at ? 1 : -1));
    const covers = items
      .map((i) => {
        const ci = i.content_items as unknown as { preview_path: string | null } | null;
        return publicPreviewUrl(supabase, ci?.preview_path ?? null);
      })
      .filter(Boolean)
      .slice(0, 4) as string[];
    return { id: b.id, name: b.name, count: items.length, covers };
  });

  return (
    <div className="space-y-10">
      <div className="mx-auto max-w-2xl">
        <NewBoardForm />
      </div>

      {cards.length === 0 ? (
        <p className="text-center font-serif text-xl text-cocoa/70">
          No boards yet. Create one above, or tap the bookmark on any video,
          template or image in the library.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.id} href={`/boards/${c.id}`} className="group border border-cocoa/25 bg-paper p-2 transition hover:-translate-y-1">
              <div className="grid aspect-square grid-cols-2 gap-0.5 overflow-hidden bg-rose/30">
                {[0, 1, 2, 3].map((i) =>
                  c.covers[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={c.covers[i]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span key={i} className="bg-rose/30" />
                  ),
                )}
              </div>
              <div className="p-3">
                <h2 className="truncate font-serif text-xl text-ink">{c.name}</h2>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                  {c.count} item{c.count === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BoardsPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">Library</p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-8xl">My boards</h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Your saved videos, templates and images, organised your way.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <Suspense fallback={<p className="text-center font-serif text-lg text-cocoa/70">Loading...</p>}>
          <Boards />
        </Suspense>
      </section>
    </div>
  );
}
