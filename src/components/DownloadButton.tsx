"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DownloadButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
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
      if (!res.ok || !data.url) {
        setError(data.error ?? "Download failed. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
      setLoading(false);
    } catch {
      setError("Download failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-cocoa px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
      >
        {loading ? "One moment..." : "Download"}
      </button>
      {error && <p className="mt-2 font-serif text-base text-red-800">{error}</p>}
    </div>
  );
}