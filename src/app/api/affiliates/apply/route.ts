import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { codeError, normalizeCode } from "@/lib/affiliates";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const code = normalizeCode(body.code);
  const payoutEmail =
    typeof body.payoutEmail === "string" ? body.payoutEmail.trim() : "";

  const badCode = codeError(code);
  if (badCode) return NextResponse.json({ error: badCode }, { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payoutEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid payout email." },
      { status: 400 },
    );
  }

  if (body.agree !== true) {
    return NextResponse.json(
      { error: "Please agree to the Affiliate Terms." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("affiliates")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "You have already applied." },
      { status: 409 },
    );
  }

  const { error } = await admin.from("affiliates").insert({
    user_id: user.id,
    code,
    payout_email: payoutEmail,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That code is taken. Try another." },
        { status: 409 },
      );
    }
    console.error("Affiliate apply failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
