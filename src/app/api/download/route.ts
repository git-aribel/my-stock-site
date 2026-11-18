import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";
import { hasDownloadAccess } from "@/lib/access";

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

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!(await hasDownloadAccess(supabase, user.id))) {
    return NextResponse.json(
      { error: "An active membership is required to download.", code: "subscribe" },
      { status: 403 }
    );
  }

  const { data: item } = await supabase
    .from("content_items")
    .select("file_path")
    .eq("id", id)
    .single();

  if (!item?.file_path) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const rawName = item.file_path.split("/").pop() ?? "download";
  const filename = rawName.length > 37 ? rawName.slice(37) : rawName;

  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: item.file_path,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn: 300 }
  );

  return NextResponse.json({ url });
}