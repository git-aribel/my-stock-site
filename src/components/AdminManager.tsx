"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Item = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  tags: string[] | null;
  preview_path: string | null;
  published: boolean;
  collection_id: string | null;
};

type Collection = { id: string; name: string; category: string };

const FILTERS = [
  { value: "all", label: "All" },
  { value: "video", label: "Videos" },
  { value: "template", label: "Templates" },
  { value: "image", label: "Images" },
  { value: "sticker", label: "Stickers" },
];

const inputClass =
  "w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const smallBtn =
  "border border-cocoa/30 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa transition hover:bg-rose/40 disabled:opacity-60";

export default function AdminManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    tags: "",
    collectionId: "",
  });
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase
        .from("content_items")
        .select(
          "id, title, category, description, tags, preview_path, published, collection_id",
        )
        .order("created_at", { ascending: false }),
      supabase.from("collections").select("id, name, category").order("name"),
    ]).then(([itemsRes, colsRes]) => {
      if (itemsRes.error) setError(itemsRes.error.message);
      else setItems((itemsRes.data as Item[]) ?? []);
      setCollections((colsRes.data as Collection[]) ?? []);
      setLoading(false);
    });
  }, []);

  function previewUrl(path: string | null) {
    if (!path) return null;
    return createClient().storage.from("previews").getPublicUrl(path).data
      .publicUrl;
  }

  function collectionName(id: string | null) {
    return collections.find((c) => c.id === id)?.name ?? null;
  }

  function startEdit(item: Item) {
    setError(null);
    setEditingId(item.id);
    setDraft({
      title: item.title,
      description: item.description ?? "",
      tags: (item.tags ?? []).join(", "),
      collectionId: item.collection_id ?? "",
    });
  }

  async function saveEdit(id: string) {
    const title = draft.title.trim();
    if (!title) {
      setError("The title can't be empty.");
      return;
    }

    const description = draft.description.trim() || null;
    const tags = draft.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const collection_id = draft.collectionId || null;

    setBusyId(id);
    setError(null);

    const { error } = await createClient()
      .from("content_items")
      .update({ title, description, tags, collection_id })
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, title, description, tags, collection_id } : i,
        ),
      );
      setEditingId(null);
    }
    setBusyId(null);
  }

  async function togglePublished(item: Item) {
    setBusyId(item.id);
    setError(null);

    const { error } = await createClient()
      .from("content_items")
      .update({ published: !item.published })
      .eq("id", item.id);

    if (error) {
      setError(error.message);
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, published: !item.published } : i,
        ),
      );
    }
    setBusyId(null);
  }

  async function remove(item: Item) {
    const ok = window.confirm(
      `Delete "${item.title}" permanently? This removes the file and preview and cannot be undone.`,
    );
    if (!ok) return;

    setBusyId(item.id);
    setError(null);

    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
    setBusyId(null);
  }

  const q = query.trim().toLowerCase();
  const visible = items.filter((i) => {
    const matchesCategory = filter === "all" || i.category === filter;
    const matchesQuery =
      !q ||
      i.title.toLowerCase().includes(q) ||
      (i.tags ?? []).some((t) => t.includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
          {loading
            ? "Loading..."
            : `${visible.length} of ${items.length} items`}
        </p>
        <div className="flex gap-3">
          <Link
            href="/admin/reviews"
            className="border border-cocoa px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
          >
            Reviews
          </Link>
          <Link
            href="/admin/collections"
            className="border border-cocoa px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
          >
            Collections
          </Link>
          <Link
            href="/admin/upload"
            className="bg-cocoa px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
          >
            + Upload new
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition ${
              filter === f.value
                ? "bg-cocoa text-periwinkle"
                : "border border-cocoa/30 text-cocoa hover:bg-rose/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or tag..."
        className="mt-4 w-full border border-cocoa/30 bg-paper px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim"
      />

      {error && <p className="mt-4 font-serif text-lg text-red-800">{error}</p>}

      <div className="mt-8 space-y-4">
        {!loading && visible.length === 0 && (
          <p className="py-12 text-center font-script text-4xl text-denim">
            nothing here yet
          </p>
        )}

        {visible.map((item) => {
          const url = previewUrl(item.preview_path);
          const editing = editingId === item.id;
          const busy = busyId === item.id;
          const colName = collectionName(item.collection_id);

          return (
            <div
              key={item.id}
              className={`border border-cocoa/25 bg-paper p-4 ${
                item.published ? "" : "opacity-70"
              }`}
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden bg-rose/40">
                  {url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {editing ? (
                    <div className="space-y-3">
                      <input
                        value={draft.title}
                        onChange={(e) =>
                          setDraft({ ...draft, title: e.target.value })
                        }
                        placeholder="Title"
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        value={draft.description}
                        onChange={(e) =>
                          setDraft({ ...draft, description: e.target.value })
                        }
                        placeholder="Description"
                        className={inputClass}
                      />
                      <input
                        value={draft.tags}
                        onChange={(e) =>
                          setDraft({ ...draft, tags: e.target.value })
                        }
                        placeholder="Tags, separated by commas"
                        className={inputClass}
                      />
                      <select
                        value={draft.collectionId}
                        onChange={(e) =>
                          setDraft({ ...draft, collectionId: e.target.value })
                        }
                        className={inputClass}
                      >
                        <option value="">No collection</option>
                        {collections
                          .filter((c) => c.category === item.category)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(item.id)}
                          disabled={busy}
                          className="bg-cocoa px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-periwinkle disabled:opacity-60"
                        >
                          {busy ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          disabled={busy}
                          className={smallBtn}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="truncate font-serif text-xl text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                        {item.category}
                        {colName ? ` · ${colName}` : ""}
                        {item.published ? "" : " · hidden"}
                        {item.tags && item.tags.length > 0
                          ? ` · ${item.tags.join(", ")}`
                          : ""}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          disabled={busy}
                          className={smallBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => togglePublished(item)}
                          disabled={busy}
                          className={smallBtn}
                        >
                          {item.published ? "Hide" : "Publish"}
                        </button>
                        <button
                          onClick={() => remove(item)}
                          disabled={busy}
                          className="border border-red-800/40 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-red-800 transition hover:bg-red-800/10 disabled:opacity-60"
                        >
                          {busy ? "Working..." : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
