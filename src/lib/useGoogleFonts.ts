"use client";

import { useEffect } from "react";
import { googleFontsUrl } from "@/lib/fontPairs";

// Adds a Google Fonts stylesheet for any families not loaded yet.
export function useGoogleFonts(families: string[]) {
  const key = families.join("|");

  useEffect(() => {
    const missing = key
      .split("|")
      .filter(Boolean)
      .filter((f) => !document.querySelector(`link[data-font="${f}"]`));
    for (const f of missing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = googleFontsUrl([f]);
      link.dataset.font = f;
      document.head.appendChild(link);
    }
  }, [key]);
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  a.click();
}
