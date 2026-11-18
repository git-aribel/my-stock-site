import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";
import { hasDownloadAccess } from "@/lib/access";

const MAX_ITEMS = 50;

function sanitize(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, "-").trim() || "file";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please log in to download.", code: "login" },
      { status: 401 }
    );
  }

  if (!(await hasDownloadAccess(supabase, user.id))) {
    return NextResponse.json(
      { error: "An active membership is required to download.", code: "subscribe" },
      { status: 403 }
    );
  }

  const { ids } = await request.json();

  if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: `Choose between 1 and ${MAX_ITEMS} items.` },
      { status: 400 }
    );
  }

  const { data: items } = await supabase
    .from("content_items")
    .select("id, title, file_path")
    .in("id", ids);

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Files not found" }, { status: 404 });
  }

  const usedNames = new Set<string>();
  const files: { name: string; url: string }[] = [];

  for (const item of items) {
    if (!item.file_path) continue;

    // Work out the file extension (e.g. .mp4) from the stored path
    const rawName = item.file_path.split("/").pop() ?? "";
    const original = rawName.length > 37 ? rawName.slice(37) : rawName;
    const dot = original.lastIndexOf(".");
    const ext = dot >= 0 ? original.slice(dot) : "";

    // Make every name inside the ZIP unique
    const base = sanitize(item.title);
    let name = `${base}${ext}`;
    let n = 2;
    while (usedNames.has(name)) {
      name = `${base} (${n})${ext}`;
      n++;
    }
    usedNames.add(name);

    const url = await getSignedUrl(
      r2,
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: item.file_path }),
      { expiresIn: 3600 }
    );

    files.push({ name, url });
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "Files not found" }, { status: 404 });
  }

  return NextResponse.json({ files });
}