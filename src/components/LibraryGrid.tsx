"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { downloadZip } from "client-zip";
import DownloadButton from "@/components/DownloadButton";
import PreviewMedia from "@/components/PreviewMedia";

type Item = {
  id: string;
  title: string;
  tags: string[] | null;
  previewUrl: string | null;
  previewVideoUrl: string | null;
};

type Props = {
  items: Item[];
  aspect: string;
  columns: string;
};

type SaveFilePicker = (options: {
  suggestedName: string;
  types?: { description: string; accept: Record<string, string[]> }[];
}) => Promise<{ createWritable: () => Promise<WritableStream> }>;

const MAX_ITEMS = 50;

export default function LibraryGrid({ items, aspect, columns }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(items.flatMap((i) => i.tags ?? [])),
  ).sort();

  const q = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    const tags = item.tags ?? [];
    const matchesTag = !activeTag || tags.includes(activeTag);
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      tags.some((t) => t.includes(q));
    return matchesTag && matchesQuery;
  });

  function toggle(id: string) {
    setError(null);
    if (!selected.has(id) && selected.size >= MAX_ITEMS) {
      setError(`You can download up to ${MAX_ITEMS} items at once.`);
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setError(null);
    setSelected(new Set(visible.slice(0, MAX_ITEMS).map((i) => i.id)));
    if (visible.length > MAX_ITEMS) {
      setError(
        `Selected the first ${MAX_ITEMS} items (the maximum per download).`,
      );
    }
  }

  async function handleBulk() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    setError(null);
    setBusy(true);
    setStatus("Preparing...");

    const zipName = `socials-bestie-${new Date().toISOString().slice(0, 10)}.zip`;
    const picker = (
      window as unknown as { showSaveFilePicker?: SaveFilePicker }
    ).showSaveFilePicker;

    let writable: WritableStream | null = null;
    let completed = false;
    let finalStatus: string | null = null;

    try {
      if (picker) {
        try {
          const handle = await picker({
            suggestedName: zipName,
            types: [
              {
                description: "ZIP file",
                accept: { "application/zip": [".zip"] },
              },
            ],
          });
          writable = await handle.createWritable();
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
          throw err;
        }
      }

      const res = await fetch("/api/download/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();

      if (data.code === "login") {
        router.push("/login");
        return;
      }
      if (data.code === "subscribe") {
        router.push("/pricing");
        return;
      }
      if (!res.ok || !data.files) {
        throw new Error(data.error ?? "Download failed. Please try again.");
      }

      const files = data.files as { name: string; url: string }[];
      const total = files.length;

      async function* entries() {
        let n = 0;
        for (const f of files) {
          n++;
          setStatus(`Adding file ${n} of ${total}... keep this tab open.`);
          const r = await fetch(f.url);
          if (!r.ok) {
            throw new Error(`Could not fetch "${f.name}" (${r.status}).`);
          }
          yield { name: f.name, lastModified: new Date(), input: r };
        }
      }

      const zip = downloadZip(entries());

      if (writable && zip.body) {
        await zip.body.pipeTo(writable);
      } else {
        const blob = await zip.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = zipName;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }

      completed = true;
      finalStatus = `Done! ${total} file${total === 1 ? "" : "s"} downloaded.`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      if (writable && !completed) writable.abort().catch(() => {});
      setBusy(false);
      setStatus(finalStatus);
    }
  }

  return (
    <div className="pb-28">
      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or tag..."
          className="w-full border border-cocoa/30 bg-paper px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim"
        />
      </div>

      {/* Tag chips */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition ${
              activeTag === null
                ? "bg-cocoa text-periwinkle"
                : "border border-cocoa/30 text-cocoa hover:bg-rose/40"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] transition ${
                activeTag === tag
                  ? "bg-cocoa text-periwinkle"
                  : "border border-cocoa/30 text-cocoa hover:bg-rose/40"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
        <span>
          {visible.length} item{visible.length === 1 ? "" : "s"}
        </span>
        <div className="flex gap-6">
          <button onClick={selectAll} className="hover:text-denim">
            Select all
          </button>
          <button
            onClick={() => {
              setSelected(new Set());
              setError(null);
              setStatus(null);
            }}
            className="hover:text-denim"
          >
            Clear
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center font-script text-4xl text-denim">
          nothing matches your search
        </p>
      ) : (
        <div className={`grid gap-6 ${columns}`}>
          {visible.map((item) => (
            <div key={item.id} className="border border-cocoa/25 bg-paper p-2">
              <div className={`relative ${aspect} overflow-hidden bg-rose/40`}>
                <PreviewMedia
                  imageUrl={item.previewUrl}
                  videoUrl={item.previewVideoUrl}
                  alt={item.title}
                />
                <label className="absolute left-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center border border-cocoa/40 bg-cream/90">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 accent-denim"
                    aria-label={`Select ${item.title}`}
                  />
                </label>
              </div>
              <div className="space-y-3 p-3">
                <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                {item.tags && item.tags.length > 0 && (
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/60">
                    {item.tags.slice(0, 3).join(" · ")}
                  </p>
                )}
                <DownloadButton itemId={item.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {(selected.size > 0 || status || error) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cocoa/25 bg-cream/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="font-serif text-lg text-cocoa">
              {error ? (
                <span className="text-red-800">{error}</span>
              ) : status ? (
                <span className="text-denim">{status}</span>
              ) : (
                <span>{selected.size} selected</span>
              )}
            </div>
            <button
              onClick={handleBulk}
              disabled={busy || selected.size === 0}
              className="bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
            >
              {busy
                ? "Working..."
                : `Download ${selected.size} selected (.zip)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
