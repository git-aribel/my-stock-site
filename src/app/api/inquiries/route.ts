import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUDGETS, TIMELINES, getService } from "@/lib/services";

const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill in the hidden "website" field; pretend it worked
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const service = getService(text(body.service, 100));
  if (!service) {
    return NextResponse.json({ error: "Unknown service." }, { status: 400 });
  }

  const name = text(body.name, 100);
  const email = text(body.email, 200);
  const message = text(body.message, 3000);
  if (!name || !message) {
    return NextResponse.json(
      { error: "Please fill in your name and project details." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Please agree to the privacy terms." },
      { status: 400 },
    );
  }

  // Keep only answers to this service's own questions, with allowed values
  const raw = (body.details ?? {}) as Record<string, unknown>;
  const details: Record<string, string | string[]> = {};
  for (const f of service.fields) {
    const v = raw[f.name];
    if (f.type === "checkboxes") {
      const picked = Array.isArray(v)
        ? v.filter((o): o is string => typeof o === "string" && f.options.includes(o))
        : [];
      if (picked.length) details[f.name] = picked;
    } else if (f.type === "select") {
      if (typeof v === "string" && f.options.includes(v)) details[f.name] = v;
    } else {
      const t = text(v, 200);
      if (t) details[f.name] = t;
    }
    if (f.required && !details[f.name]) {
      return NextResponse.json(
        { error: `Please answer: ${f.label}` },
        { status: 400 },
      );
    }
  }

  const budget = text(body.budget, 50);
  const timeline = text(body.timeline, 50);

  const admin = createAdminClient();
  const { error } = await admin.from("service_inquiries").insert({
    service: service.slug,
    name,
    email,
    business: text(body.business, 150) || null,
    budget: BUDGETS.includes(budget) ? budget : null,
    timeline: TIMELINES.includes(timeline) ? timeline : null,
    message,
    details,
  });

  if (error) {
    console.error("Saving inquiry failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
