// ✏️ CHANGE YOUR AFFILIATE PROGRAM SETTINGS HERE
// Keep these in sync with the Affiliate Terms page (it reads them too).
export const COMMISSION_PERCENT = 30;
// Affiliates earn on a referred member's payments for this many months.
export const COMMISSION_MONTHS = 12;
// Commissions wait this long before payout, in case of refunds.
export const HOLD_DAYS = 30;
// Minimum balance before we send a payout, in cents.
export const MIN_PAYOUT_CENTS = 2500;
// How long the referral cookie lasts. The privacy policy says 60 days.
export const COOKIE_DAYS = 60;
export const REFERRAL_COOKIE = "sb_ref";

const RESERVED = new Set(["admin", "socialsbestie", "socials-bestie", "support"]);

export function normalizeCode(raw: unknown) {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

export function codeError(code: string): string | null {
  if (!/^[a-z0-9-]{3,24}$/.test(code)) {
    return "Use 3 to 24 letters, numbers or dashes.";
  }
  if (RESERVED.has(code)) return "That code is not available.";
  return null;
}

export function formatMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

// Commissions created before this time are past the refund hold.
export function holdCutoff() {
  return Date.now() - HOLD_DAYS * 24 * 60 * 60 * 1000;
}

// Only allow redirects to pages on this site (e.g. "/affiliates/join").
export function safeNext(raw: string | null | undefined) {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : null;
}
