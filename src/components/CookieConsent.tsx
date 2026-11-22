"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GA_ID,
  OPEN_SETTINGS_EVENT,
  clearAnalyticsCookies,
  loadAnalytics,
  readConsent,
  saveConsent,
} from "@/lib/analytics";

// Asks visitors before any analytics cookies are saved. Google Analytics
// only loads after they click "Accept".
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const consent = readConsent();
    if (consent === "granted") loadAnalytics();
    // Tidy up any analytics cookies left from before they declined
    else if (consent === "denied") clearAnalyticsCookies();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!GA_ID || !open) return null;

  function accept() {
    saveConsent("granted");
    loadAnalytics();
    setOpen(false);
  }

  function decline() {
    const wasOn = !!window.gtag;
    // Tell Google Analytics to stop saving cookies straight away
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    saveConsent("denied");
    clearAnalyticsCookies();
    setOpen(false);
    // Analytics was already running on this page: reload so it stops
    if (wasOn) location.reload();
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:left-auto sm:right-0 sm:max-w-md"
    >
      <div className="rounded-[12px] border border-cocoa/20 bg-paper p-5 shadow-[0_16px_40px_-20px_rgba(74,47,39,0.5)]">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-rose-deep">Cookies</p>
        <p className="mt-2 font-serif text-lg leading-snug text-ink/85">
          Can we use analytics cookies to see how people find and use the site?
          It helps us make it better. No ads, and we never sell your data.{" "}
          <Link href="/privacy" className="underline hover:text-denim">
            Learn more
          </Link>
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={decline}
            className="flex-1 border border-cocoa px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 bg-cocoa px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// "Cookie settings" link for the footer, so visitors can change their answer
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
