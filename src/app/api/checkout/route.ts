import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { REFERRAL_COOKIE, normalizeCode } from "@/lib/affiliates";

// Returns affiliate metadata for the subscription, if this visitor accepted
// a partner's referral cookie and is a brand new member.
async function referralMetadata(userId: string): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const code = normalizeCode(cookieStore.get(REFERRAL_COOKIE)?.value);
  if (!code) return {};

  const admin = createAdminClient();
  const { data: affiliate } = await admin
    .from("affiliates")
    .select("id, user_id")
    .eq("code", code)
    .eq("status", "approved")
    .maybeSingle();

  // No self-referrals
  if (!affiliate || affiliate.user_id === userId) return {};

  // Only new members count, not people who were members before
  const { count } = await admin
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("status", "in", "(incomplete,incomplete_expired)");
  if (count && count > 0) return {};

  return {
    affiliate_id: affiliate.id,
    referred_at: String(Math.floor(Date.now() / 1000)),
  };
}

const PRICES: Record<string, string | undefined> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  annual: process.env.STRIPE_PRICE_ANNUAL,
};

export async function POST(request: Request) {
  const { plan } = await request.json();
  const priceId = PRICES[plan];

  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Don't let an active member buy a second subscription
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .in("status", ["active", "trialing"])
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: "You already have an active membership." },
      { status: 409 }
    );
  }

  const origin = new URL(request.url).origin;
  const referral = await referralMetadata(user.id);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    subscription_data: { metadata: { user_id: user.id, plan, ...referral } },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}