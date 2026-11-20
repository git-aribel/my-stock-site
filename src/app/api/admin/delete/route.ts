import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

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

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { data: item } = await supabase
    .from("content_items")
    .select("id, file_path, preview_path, preview_video_path")
    .eq("id", id)
    .single();

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  try {
    if (item.file_path) {
      await r2.send(
        new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: item.file_path }),
      );
    }
    const previewFiles = [item.preview_path, item.preview_video_path].filter(
      (p): p is string => !!p,
    );
    if (previewFiles.length > 0) {
      await supabase.storage.from("previews").remove(previewFiles);
    }
  } catch (err) {
    console.error("Delete storage error:", err);
    return NextResponse.json(
      { error: "Could not delete the files from storage." },
      { status: 500 },
    );
  }

  const { error } = await supabase.from("content_items").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
