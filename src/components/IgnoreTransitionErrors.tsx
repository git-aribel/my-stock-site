"use client";

import { useEffect } from "react";

// The smooth page fades use the browser's View Transitions. If the tab is in
// the background (or the visitor clicks again mid-fade), the browser cancels
// the fade and reports "Transition was aborted because of invalid state".
// The page itself still changes normally, so this is only noise: hide it.
export default function IgnoreTransitionErrors() {
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const err = e.reason as { name?: string; message?: string } | undefined;
      if (
        (err?.name === "InvalidStateError" || err?.name === "AbortError") &&
        /transition/i.test(err?.message ?? "")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", onRejection);
    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);
  return null;
}
