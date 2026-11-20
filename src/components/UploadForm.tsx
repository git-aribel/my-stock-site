"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_MB = 2000;
const MAX_CLIP_MB = 20;

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function putWithProgress(
  url: string,
  file: File,
  contentType: string,
  onProgress: (pct: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () =>
      reject(new Error("Upload failed. Check the R2 CORS settings."));
    xhr.send(file);
  });
}

type Collection = { id: string; name: string; category: string };

const inputClass =
  "mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("video");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewClip, setPreviewClip] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionId, setCollectionId] = useState("");

  useEffect(() => {
    createClient()
      .from("collections")
      .select("id, name, category")
      .order("name")
      .then(({ data }) => setCollections((data as Collection[]) ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!previewFile || !mainFile) {
      setError("Please choose both a preview image and the main file.");
      return;
    }
    if (mainFile.size > MAX_MB * 1024 * 1024) {
      setError(`The main file is over ${MAX_MB} MB.`);
      return;
    }

    const clip = category === "video" ? previewClip : null;
    if (clip && clip.size > MAX_CLIP_MB * 1024 * 1024) {
      setError(
        `The preview clip is over ${MAX_CLIP_MB} MB. Please compress it (a few MB is ideal).`,
      );
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const id = crypto.randomUUID();
    const previewPath = `${category}/${id}-${cleanName(previewFile.name)}`;
    const clipPath = clip
      ? `${category}/${id}-clip-${cleanName(clip.name)}`
      : null;
    const toRemove = [previewPath, ...(clipPath ? [clipPath] : [])];

    // 1. Preview image -> Supabase
    setStatus("Uploading preview image...");
    const { error: previewError } = await supabase.storage
      .from("previews")
      .upload(previewPath, previewFile);

    if (previewError) {
      setError(`Preview upload failed: ${previewError.message}`);
      setBusy(false);
      setStatus(null);
      return;
    }

    // 2. Preview clip -> Supabase (optional)
    if (clip && clipPath) {
      setStatus("Uploading preview clip...");
      const { error: clipError } = await supabase.storage
        .from("previews")
        .upload(clipPath, clip);

      if (clipError) {
        await supabase.storage.from("previews").remove(toRemove);
        setError(`Preview clip upload failed: ${clipError.message}`);
        setBusy(false);
        setStatus(null);
        return;
      }
    }

    // 3. Main file -> R2
    try {
      setStatus("Preparing upload...");
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          filename: mainFile.name,
          contentType: mainFile.type,
        }),
      });
      const sign = await signRes.json();
      if (!signRes.ok)
        throw new Error(sign.error ?? "Could not prepare upload");

      await putWithProgress(sign.url, mainFile, sign.contentType, (pct) =>
        setStatus(`Uploading file... ${pct}%`),
      );

      // 4. Save details
      setStatus("Saving details...");
      const { error: dbError } = await supabase.from("content_items").insert({
        title,
        category,
        description: description || null,
        tags: tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        file_path: sign.key,
        preview_path: previewPath,
        preview_video_path: clipPath,
        collection_id: collectionId || null,
      });
      if (dbError) throw new Error(`Saving failed: ${dbError.message}`);
    } catch (err) {
      await supabase.storage.from("previews").remove(toRemove);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
      setStatus(null);
      return;
    }

    setStatus(`Uploaded "${title}" successfully!`);
    setTitle("");
    setDescription("");
    setTags("");
    setPreviewFile(null);
    setPreviewClip(null);
    setMainFile(null);
    setFormKey((k) => k + 1);
    setBusy(false);
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCollectionId("");
          }}
          className={inputClass}
        >
          <option value="video">Video</option>
          <option value="template">Canva template</option>
          <option value="image">Image</option>
          <option value="sticker">Sticker</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Collection (optional)</label>
        <select
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className={inputClass}
        >
          <option value="">No collection</option>
          {collections
            .filter((c) => c.category === category)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Description (optional)</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Tags (separated by commas)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="floral, vintage, soft"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Preview image</label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full font-serif text-base text-cocoa"
        />
      </div>

      {category === "video" && (
        <div>
          <label className={labelClass}>
            Preview clip (optional, plays on hover, max {MAX_CLIP_MB} MB)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setPreviewClip(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full font-serif text-base text-cocoa"
          />
          <p className="mt-2 font-serif text-base text-cocoa/60">
            Keep it short (3 to 8 seconds), 720p or smaller, and a few MB. This
            clip is public, so don&apos;t use the full-quality video.
          </p>
        </div>
      )}

      <div>
        <label className={labelClass}>Main file</label>
        <input
          type="file"
          required
          onChange={(e) => setMainFile(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full font-serif text-base text-cocoa"
        />
      </div>

      {error && <p className="font-serif text-lg text-red-800">{error}</p>}
      {status && !error && (
        <p className="font-serif text-lg text-denim">{status}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
      >
        {busy ? "Working..." : "Upload"}
      </button>
    </form>
  );
}
