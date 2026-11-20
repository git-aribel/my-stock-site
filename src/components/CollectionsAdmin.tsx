"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Collection = {
  id: string;
  name: string;
  category: string;
  description: string | null;
};

const CATS = [
  { value: "video", label: "Videos" },
  { value: "template", label: "Templates" },
  { value: "image", label: "Images" },
  { value: "sticker", label: "Stickers" },
];

function slugify(s: string) {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "collection"}-${Math.random().toString(36).slice(2, 6)}`;
}

const inputClass =
  "mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa";

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("video");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const supabase = createClient();
    const [{ data: cols }, { data: items }] = await Promise.all([
      supabase
        .from("collections")
        .select("id, name, category, description")
        .order("created_at", { ascending: false }),
      supabase.from("content_items").select("collection_id"),
    ]);
    setCollections((cols as Collection[]) ?? []);
    const c: Record<string, number> = {};
    (items ?? []).forEach((i: { collection_id: string | null }) => {
      if (i.collection_id) c[i.collection_id] = (c[i.collection_id] ?? 0) + 1;
    });
    setCounts(c);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) return;

    setBusy(true);
    const { error } = await createClient()
      .from("collections")
      .insert({
        name: trimmed,
        category,
        description: description.trim() || null,
        slug: slugify(trimmed),
      });
    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }
    setName("");
    setDescription("");
    load();
  }

  async function handleDelete(c: Collection) {
    const ok = window.confirm(
      `Delete the collection "${c.name}"? Its items are kept, they just won't belong to a collection anymore.`,
    );
    if (!ok) return;

    const { error } = await createClient()
      .from("collections")
      .delete()
      .eq("id", c.id);
    if (error) setError(error.message);
    else load();
  }

  return (
    <div className="space-y-12">
      <form
        onSubmit={handleCreate}
        className="space-y-5 border border-cocoa/25 bg-paper p-6"
      >
        <div>
          <label className={labelClass}>Collection name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cozy mornings"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Section</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Description (optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="font-serif text-lg text-red-800">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
        >
          {busy ? "Creating..." : "Create collection"}
        </button>
      </form>

      <div className="space-y-8">
        {CATS.map((cat) => {
          const list = collections.filter((c) => c.category === cat.value);
          return (
            <div key={cat.value}>
              <h2 className="text-[0.75rem] uppercase tracking-[0.25em] text-denim">
                {cat.label}
              </h2>
              {list.length === 0 ? (
                <p className="mt-3 font-serif text-lg text-cocoa/60">
                  No collections yet.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-cocoa/15 border-y border-cocoa/15">
                  {list.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-serif text-xl text-ink">
                          {c.name}
                        </p>
                        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                          {counts[c.id] ?? 0} items
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(c)}
                        className="border border-red-800/40 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-red-800 transition hover:bg-red-800/10"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
