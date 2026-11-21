import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasDownloadAccess } from "@/lib/access";
import { ITEM_COLUMNS, toGridItem } from "@/lib/library";
import LibraryGrid from "@/components/LibraryGrid";
import { BoardActions } from "@/components/BoardControls";

export const metadata: Metadata = { title: "Board | Socials Bestie" };

async function BoardView({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !(await hasDownloadAccess(supabase, user.id))) redirect("/boards");

  // Row level security only returns the member's own boards
  const { data: board } = await supabase.from("boards").select("id, name").eq("id", id).maybeSingle();
  if (!board) notFound();

  const { data: rows } = await supabase
    .from("board_items")
    .select(`created_at, content_items(${ITEM_COLUMNS})`)
    .eq("board_id", id)
    .order("created_at", { ascending: false });

  const items = (rows ?? [])
    .map((r) => r.content_items as unknown as Parameters<typeof toGridItem>[1] | null)
    .filter((r): r is Parameters<typeof toGridItem>[1] => !!r)
    .map((r) => toGridItem(supabase, r));

  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-20">
          <Link href="/boards" className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80 hover:text-periwinkle">
            ← My boards
          </Link>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-8xl">{board.name}</h1>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
          <div className="mt-8">
            <BoardActions boardId={board.id} name={board.name} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-14">
        {items.length === 0 ? (
          <p className="text-center font-serif text-xl text-cocoa/70">
            This board is empty. Tap the bookmark on any item in the{" "}
            <Link href="/videos" className="text-denim underline">library</Link> to add it here.
          </p>
        ) : (
          <LibraryGrid items={items} aspect="aspect-square" columns="grid-cols-2 md:grid-cols-4" />
        )}
      </section>
    </div>
  );
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<section className="linen h-[360px]" />}>
      <BoardView params={params} />
    </Suspense>
  );
}
