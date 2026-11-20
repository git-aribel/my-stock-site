import type { SupabaseClient } from "@supabase/supabase-js";

export const ITEM_COLUMNS =
  "id, title, tags, preview_path, preview_video_path, collection_id, created_at";

type Row = {
  id: string;
  title: string;
  tags: string[] | null;
  preview_path: string | null;
  preview_video_path: string | null;
};

export function publicPreviewUrl(
  supabase: SupabaseClient,
  path: string | null,
) {
  if (!path) return null;
  return supabase.storage.from("previews").getPublicUrl(path).data.publicUrl;
}

export function toGridItem(supabase: SupabaseClient, row: Row) {
  return {
    id: row.id,
    title: row.title,
    tags: row.tags ?? null,
    previewUrl: publicPreviewUrl(supabase, row.preview_path),
    previewVideoUrl: publicPreviewUrl(supabase, row.preview_video_path),
  };
}
