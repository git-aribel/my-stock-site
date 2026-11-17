import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = ["video", "template", "image", "sticker"];

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const { category, filename, contentType } = await request.json();

  if (!CATEGORIES.includes(category) || !filename) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const key = `${category}/${crypto.randomUUID()}-${cleanName(filename)}`;
  const type = contentType || "application/octet-stream";

  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: type }),
    { expiresIn: 3600 }
  );

  return NextResponse.json({ url, key, contentType: type });
}