import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// ✏️ WELCOME OFFER SETTINGS
export const OFFER_PERCENT = 15;
// "once" = 15% off the first payment (first month, or first year on Annual)
export const OFFER_DURATION: Stripe.CouponCreateParams.Duration = "once";
// The Stripe coupon every personal code points to (created automatically)
const COUPON_ID = "welcome-15";

// The wording people agree to when they sign up (saved with each signup)
export const CONSENT_TEXT = `Send me my ${OFFER_PERCENT}% welcome code and occasional emails from Socials Bestie with new content, ideas and offers. I can unsubscribe at any time.`;

// Cookie that remembers the signup so the code is applied at checkout
export const OFFER_COOKIE = "sb_offer";
export const OFFER_COOKIE_DAYS = 90;

async function couponId() {
  try {
    const existing = await stripe.coupons.retrieve(COUPON_ID);
    if (existing.valid) return existing.id;
  } catch {
    // Not created yet
  }
  const coupon = await stripe.coupons.create({
    id: COUPON_ID,
    name: `Welcome ${OFFER_PERCENT}% off`,
    percent_off: OFFER_PERCENT,
    duration: OFFER_DURATION,
  });
  return coupon.id;
}

// A personal, single-use code for new customers, e.g. WELCOME-7K2M9Q
export async function createWelcomeCode() {
  const coupon = await couponId();
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 3; attempt++) {
    const suffix = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
    try {
      const promo = await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon },
        code: `WELCOME-${suffix}`,
        max_redemptions: 1,
        restrictions: { first_time_transaction: true },
      });
      return { code: promo.code, id: promo.id };
    } catch (err) {
      // Try another code if this one is already taken
      if (attempt === 2) throw err;
    }
  }
  throw new Error("Could not create a code");
}

export type Offer = { code: string; promoCodeId: string | null };

// The signup's code, if the cookie belongs to an active subscriber
export async function getOffer(cookieValue: string | undefined): Promise<Offer | null> {
  if (!cookieValue || !/^[0-9a-f-]{36}$/.test(cookieValue)) return null;
  const { data } = await createAdminClient()
    .from("email_subscribers")
    .select("promo_code, promo_code_id")
    .eq("id", cookieValue)
    .is("unsubscribed_at", null)
    .maybeSingle();
  if (!data?.promo_code) return null;
  return { code: data.promo_code, promoCodeId: data.promo_code_id };
}

// Whether a code can still be used (not used up or switched off)
export async function isCodeUsable(promoCodeId: string | null) {
  if (!promoCodeId) return false;
  try {
    const promo = await stripe.promotionCodes.retrieve(promoCodeId);
    return promo.active && (promo.max_redemptions == null || promo.times_redeemed < promo.max_redemptions);
  } catch {
    return false;
  }
}
