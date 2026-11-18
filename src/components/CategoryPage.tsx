import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import LibraryGrid from "@/components/LibraryGrid";

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
  const { data } = await supabase
    .from("content_items")
    .select("id, title, tags, preview_path")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) {
    return (
      <p className="text-center font-script text-5xl text-denim">
        coming soon
      </p>
    );
  }

  const items = data.map((item) => ({
    id: item.id as string,
    title: item.title as string,
    tags: (item.tags as string[] | null) ?? null,
    previewUrl: item.preview_path
      ? supabase.storage.from("previews").getPublicUrl(item.preview_path).data
          .publicUrl
      : null,
  }));

  return <LibraryGrid items={items} aspect={aspect} columns={columns} />;
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