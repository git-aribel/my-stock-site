// ✏️ GOOGLE ANALYTICS
// Set NEXT_PUBLIC_GA_ID (looks like G-XXXXXXXXXX) in Vercel and in .env.local.
// Until it is set, no cookie banner is shown and nothing is tracked.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

// The visitor's answer to the cookie banner, kept for about 6 months
export const CONSENT_COOKIE = "sb_consent";
const CONSENT_DAYS = 180;
export type Consent = "granted" | "denied";

// Ask the banner to open again (used by "Cookie settings" in the footer)
export const OPEN_SETTINGS_EVENT = "sb:cookie-settings";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): Consent | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
  return (match?.[1] as Consent) ?? null;
}

export function saveConsent(value: Consent) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
}

// Loads Google Analytics. Only ever called after the visitor clicks Accept.
export function loadAnalytics() {
  if (!GA_ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag expects the arguments object itself
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  // Page changes inside the site are tracked automatically by Google
  // Analytics ("enhanced measurement"). Cookies are kept for 13 months.
  window.gtag("config", GA_ID, { cookie_expires: 13 * 30 * 86400 });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

// Removes the Google Analytics cookies when someone changes their mind
export function clearAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split("; ").map((c) => c.split("=")[0])) {
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      for (const d of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
      }
    }
  }
}

// Sends an event (e.g. "sign_up", "purchase") if the visitor allowed analytics
export function track(event: string, params: Record<string, unknown> = {}) {
  if (!window.gtag && readConsent() === "granted") loadAnalytics();
  window.gtag?.("event", event, params);
}
