"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Sends one analytics event when the page opens (e.g. "purchase" on the
// thank-you page). `once` stops it counting twice if the page is refreshed.
export default function TrackEvent({ event, once }: { event: string; once?: string }) {
  useEffect(() => {
    try {
      if (once && sessionStorage.getItem(once)) return;
      if (once) sessionStorage.setItem(once, "1");
    } catch {}
    track(event);
  }, [event, once]);
  return null;
}
