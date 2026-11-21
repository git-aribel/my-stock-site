import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LibraryGrid from "@/components/LibraryGrid";
import { CATEGORIES } from "@/lib/categories";
import { ITEM_COLUMNS, toGridItem } from "@/lib/library";
import { viewerIsMember } from "@/lib/access";
import MembersTeaser from "@/components/MembersTeaser";

async function CollectionView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;

  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("id, name, description, category")
    .eq("slug", slug)
    .maybeSingle();

  if (!collection) notFound();

  const cat = CATEGORIES[collection.category];

  const { data: rows } = await supabase
    .from("content_items")
    .select(ITEM_COLUMNS)
    .eq("collection_id", collection.id)
    .order("created_at", { ascending: false });

  // Non-members only see a small preview (none at all for templates)
  const { loggedIn, member } = await viewerIsMember(supabase);
  const all = rows ?? [];
  const visible = member ? all : all.slice(0, cat.preview);
  const items = visible.map((r) => toGridItem(supabase, r));

  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <Link
            href={cat.path}
            className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80 hover:text-periwinkle"
          >
            ← {cat.label}
          </Link>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {all.length === 0 ? (
          <p className="text-center font-script text-5xl text-denim">
            coming soon
          </p>
        ) : (
          <>
            {items.length > 0 && (
              <LibraryGrid
                items={items}
                aspect={cat.aspect}
                columns={cat.columns}
              />
            )}
            {!member && all.length > visible.length && (
              <MembersTeaser
                total={all.length}
                shown={visible.length}
                noun={cat.noun}
                loggedIn={loggedIn}
                next={`/collection/${slug}`}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="py-24 text-center font-serif text-xl text-cocoa/70">
          Loading...
        </p>
      }
    >
      <CollectionView params={params} />
    </Suspense>
  );
}
