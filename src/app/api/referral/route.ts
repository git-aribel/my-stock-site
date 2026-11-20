import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  COOKIE_DAYS,
  REFERRAL_COOKIE,
  normalizeCode,
} from "@/lib/affiliates";

// Called only after the visitor accepts the referral cookie banner.
export async function POST(request: Request) {
  const { code: raw } = await request.json().catch(() => ({}));
  const code = normalizeCode(raw);
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: affiliate } = await admin
    .from("affiliates")
    .select("id")
    .eq("code", code)
    .eq("status", "approved")
    .maybeSingle();

  if (!affiliate) {
    return NextResponse.json({ error: "Unknown code" }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set(REFERRAL_COOKIE, code, {
    maxAge: COOKIE_DAYS * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
