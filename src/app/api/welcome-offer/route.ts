import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CONSENT_TEXT,
  OFFER_COOKIE,
  OFFER_COOKIE_DAYS,
  createWelcomeCode,
} from "@/lib/welcomeOffer";

// Sign up for the email list and get a personal 15% code
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  // Bots fill in the hidden "website" field; pretend it worked
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "Please tick the box to get your code." }, { status: 400 });
  }

  const admin = createAdminClient();
  // Signing up again re-subscribes and refreshes the consent record
  const { data: sub, error } = await admin
    .from("email_subscribers")
    .upsert(
      {
        email,
        source: "welcome-offer",
        consent_text: CONSENT_TEXT,
        consented_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
      { onConflict: "email" },
    )
    .select("id, promo_code")
    .single();

  if (error || !sub) {
    console.error("Welcome offer signup failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // One code per email: people who sign up twice get the same code back
  let code = sub.promo_code as string | null;
  if (!code) {
    try {
      const created = await createWelcomeCode();
      code = created.code;
      await admin
        .from("email_subscribers")
        .update({ promo_code: created.code, promo_code_id: created.id })
        .eq("id", sub.id);
    } catch (err) {
      console.error("Creating welcome code failed:", err);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(OFFER_COOKIE, sub.id, {
    maxAge: OFFER_COOKIE_DAYS * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.json({ code });
}
