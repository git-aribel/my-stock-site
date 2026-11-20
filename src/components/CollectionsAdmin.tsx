"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Collection = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  cover_path: string | null;
  cover_item_id: string | null;
};

type Item = {
  id: string;
  title: string;
  collection_id: string | null;
  preview_path: string | null;
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

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

const inputClass =
  "mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa";
const smallBtn =
  "border border-cocoa/30 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-cocoa transition hover:bg-rose/40";

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("video");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const [{ data: cols }, { data: its }] = await Promise.all([
      supabase
        .from("collections")
        .select("id, name, category, description, cover_path, cover_item_id")
        .order("created_at", { ascending: false }),
      supabase
        .from("content_items")
        .select("id, title, collection_id, preview_path")
        .order("created_at", { ascending: false }),
    ]);
    setCollections((cols as Collection[]) ?? []);
    setItems((its as Item[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  function previewUrl(path: string | null) {
    if (!path) return null;
    return createClient().storage.from("previews").getPublicUrl(path).data
      .publicUrl;
  }

  function coverPathFor(c: Collection) {
    if (c.cover_path) return c.cover_path;
    const chosen = items.find((i) => i.id === c.cover_item_id);
    if (chosen?.preview_path) return chosen.preview_path;
    return (
      items.find((i) => i.collection_id === c.id && i.preview_path)
        ?.preview_path ?? null
    );
  }

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

  async function chooseItemCover(c: Collection, itemId: string) {
    setError(null);
    setBusyId(c.id);
    const supabase = createClient();

    const { error } = await supabase
      .from("collections")
      .update({ cover_item_id: itemId || null, cover_path: null })
      .eq("id", c.id);

    if (error) {
      setError(error.message);
    } else if (c.cover_path) {
      await supabase.storage.from("previews").remove([c.cover_path]);
    }
    await load();
    setBusyId(null);
  }

  async function uploadCover(c: Collection, file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("The cover image is over 5 MB. Please use a smaller one.");
      return;
    }

    setBusyId(c.id);
    const supabase = createClient();
    const path = `collections/${c.id}-${Date.now()}-${cleanName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("previews")
      .upload(path, file);

    if (uploadError) {
      setError(`Cover upload failed: ${uploadError.message}`);
      setBusyId(null);
      return;
    }

    const { error } = await supabase
      .from("collections")
      .update({ cover_path: path, cover_item_id: null })
      .eq("id", c.id);

    if (error) {
      await supabase.storage.from("previews").remove([path]);
      setError(error.message);
    } else if (c.cover_path) {
      await supabase.storage.from("previews").remove([c.cover_path]);
    }
    await load();
    setBusyId(null);
  }

  async function handleDelete(c: Collection) {
    const ok = window.confirm(
      `Delete the collection "${c.name}"? Its items are kept, they just won't belong to a collection anymore.`,
    );
    if (!ok) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", c.id);

    if (error) {
      setError(error.message);
      return;
    }
    if (c.cover_path) {
      await supabase.storage.from("previews").remove([c.cover_path]);
    }
    load();
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

      <div className="space-y-10">
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
                  {list.map((c) => {
                    const inside = items.filter(
                      (i) => i.collection_id === c.id,
                    );
                    const url = previewUrl(coverPathFor(c));
                    const working = busyId === c.id;

                    return (
                      <div key={c.id} className="py-4">
                        <div className="flex gap-4">
                          <div className="h-20 w-16 shrink-0 overflow-hidden bg-rose/40">
                            {url && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={url}
                                alt={c.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-xl text-ink">
                              {c.name}
                            </p>
                            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                              {inside.length} items
                              {c.cover_path
                                ? " · custom cover"
                                : c.cover_item_id
                                  ? " · cover from an item"
                                  : " · cover: first item"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <select
                                value={
                                  c.cover_path ? "" : (c.cover_item_id ?? "")
                                }
                                disabled={working || inside.length === 0}
                                onChange={(e) =>
                                  chooseItemCover(c, e.target.value)
                                }
                                className="max-w-[14rem] border border-cocoa/30 bg-cream px-2 py-1.5 font-serif text-base text-cocoa"
                              >
                                <option value="">First item (default)</option>
                                {inside.map((i) => (
                                  <option key={i.id} value={i.id}>
                                    {i.title}
                                  </option>
                                ))}
                              </select>

                              <label
                                className={`${smallBtn} cursor-pointer ${
                                  working ? "opacity-60" : ""
                                }`}
                              >
                                {working ? "Working..." : "Upload cover"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={working}
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    e.target.value = "";
                                    if (f) uploadCover(c, f);
                                  }}
                                />
                              </label>

                              <button
                                onClick={() => handleDelete(c)}
                                disabled={working}
                                className="border border-red-800/40 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-red-800 transition hover:bg-red-800/10 disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
