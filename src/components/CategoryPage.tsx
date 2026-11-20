import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import LibraryGrid from "@/components/LibraryGrid";
import { ITEM_COLUMNS, publicPreviewUrl, toGridItem } from "@/lib/library";

type Props = {
  category: string;
  label: string;
  script: string;
  description: string;
  aspect: string;
  columns: string;
};

async function Items({
  category,
  aspect,
  columns,
}: Pick<Props, "category" | "aspect" | "columns">) {
  await connection();

  const supabase = await createClient();

  const [{ data: collections }, { data: rows }] = await Promise.all([
    supabase
      .from("collections")
      .select("id, name, slug, description, cover_path, cover_item_id")
      .eq("category", category)
      .order("created_at", { ascending: false }),
    supabase
      .from("content_items")
      .select(ITEM_COLUMNS)
      .eq("category", category)
      .order("created_at", { ascending: false }),
  ]);

  if (!rows || rows.length === 0) {
    return (
      <p className="text-center font-script text-5xl text-denim">coming soon</p>
    );
  }

  const cards = (collections ?? [])
    .map((c) => {
      const inside = rows.filter((r) => r.collection_id === c.id);
      const chosen = c.cover_item_id
        ? inside.find((r) => r.id === c.cover_item_id)
        : null;
      const fallback = inside.find((r) => r.preview_path);
      const coverPath =
        c.cover_path ?? chosen?.preview_path ?? fallback?.preview_path ?? null;
      return {
        ...c,
        count: inside.length,
        coverUrl: publicPreviewUrl(supabase, coverPath),
      };
    })
    .filter((c) => c.count > 0);

  const items = rows.map((r) => toGridItem(supabase, r));

  return (
    <div>
      {cards.length > 0 && (
        <div className="mb-20">
          <h2 className="text-center font-script text-5xl text-denim md:text-6xl">
            collections
          </h2>
          <div className={`mt-10 grid gap-6 ${columns}`}>
            {cards.map((c) => (
              <Link
                key={c.id}
                href={`/collection/${c.slug}`}
                className="group border border-cocoa/25 bg-paper p-2 transition hover:-translate-y-1"
              >
                <div className={`${aspect} overflow-hidden bg-rose/40`}>
                  {c.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.coverUrl}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-xl text-ink">{c.name}</h3>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                    {c.count} item{c.count === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-center font-script text-5xl text-denim md:text-6xl">
        {cards.length > 0 ? "everything" : "the library"}
      </h2>
      <div className="mt-10">
        <LibraryGrid items={items} aspect={aspect} columns={columns} />
      </div>
    </div>
  );
}

export default function CategoryPage({
  category,
  label,
  script,
  description,
  aspect,
  columns,
}: Props) {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            {label}
          </p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            {script}
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Suspense
          fallback={
            <p className="text-center font-serif text-xl text-cocoa/70">
              Loading...
            </p>
          }
        >
          <Items category={category} aspect={aspect} columns={columns} />
        </Suspense>
      </section>
    </div>
  );
}
