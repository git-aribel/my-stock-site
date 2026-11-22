import type { SupabaseClient } from "@supabase/supabase-js";

export type Review = {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  rating: number;
  body: string;
  status: "pending" | "approved" | "hidden";
  created_at: string;
};

export const REVIEW_COLUMNS = "id, user_id, name, role, rating, body, status, created_at";

// Approved reviews, newest first. Returns [] if the table doesn't exist yet.
export async function getApprovedReviews(supabase: SupabaseClient, limit = 50) {
  const { data } = await supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Review[] | null) ?? [];
}
