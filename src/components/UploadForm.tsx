"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_MB = 50;

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

const inputClass =
  "mt-2 w-full border border-cocoa/30 bg-cream px-4 py-3 font-serif text-lg text-cocoa outline-none focus:border-denim";
const labelClass = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("video");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!previewFile || !mainFile) {
      setError("Please choose both a preview image and the main file.");
      return;
    }
    if (mainFile.size > MAX_MB * 1024 * 1024) {
      setError(
        `The main file is over ${MAX_MB} MB. That's the free plan limit; a paid Supabase plan raises it.`
      );
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const id = crypto.randomUUID();
    const previewPath = `${category}/${id}-${cleanName(previewFile.name)}`;
    const filePath = `${category}/${id}-${cleanName(mainFile.name)}`;

    setStatus("Uploading preview...");
    const { error: previewError } = await supabase.storage
      .from("previews")
      .upload(previewPath, previewFile);

    if (previewError) {
      setError(`Preview upload failed: ${previewError.message}`);
      setBusy(false);
      setStatus(null);
      return;
    }

    setStatus("Uploading file (large files can take a while)...");
    const { error: fileError } = await supabase.storage
      .from("files")
      .upload(filePath, mainFile);

    if (fileError) {
      await supabase.storage.from("previews").remove([previewPath]);
      setError(`File upload failed: ${fileError.message}`);
      setBusy(false);
      setStatus(null);
      return;
    }

    setStatus("Saving details...");
    const { error: dbError } = await supabase.from("content_items").insert({
      title,
      category,
      description: description || null,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      file_path: filePath,
      preview_path: previewPath,
    });

    if (dbError) {
      await supabase.storage.from("previews").remove([previewPath]);
      await supabase.storage.from("files").remove([filePath]);
      setError(`Saving failed: ${dbError.message}`);
      setBusy(false);
      setStatus(null);
      return;
    }

    setStatus(`Uploaded "${title}" successfully!`);
    setTitle("");
    setDescription("");
    setTags("");
    setPreviewFile(null);
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
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="video">Video</option>
          <option value="template">Canva template</option>
          <option value="image">Image</option>
          <option value="sticker">Sticker</option>
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

      <div>
        <label className={labelClass}>Main file (max {MAX_MB} MB)</label>
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