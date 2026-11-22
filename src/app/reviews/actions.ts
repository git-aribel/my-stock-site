"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReviewFormState = { ok?: boolean; error?: string };

// Saves (or updates) the logged-in person's review. It always goes back to
// "pending" so you can approve it in /admin/reviews before it shows.
export async function submitReview(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in to leave a review." };

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const rating = Number(formData.get("rating"));

  if (!name || name.length > 60) return { error: "Please add your name (up to 60 characters)." };
  if (role.length > 80) return { error: "Please keep “what you do” under 80 characters." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Please choose a star rating." };
  if (body.length < 10) return { error: "Please write a little more (at least 10 characters)." };
  if (body.length > 800) return { error: "Please keep your review under 800 characters." };

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      name,
      role: role || null,
      rating,
      body,
      status: "pending",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) return { error: "Something went wrong. Please try again." };

  refresh();
  return { ok: true };
}

export async function deleteReview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("reviews").delete().eq("user_id", user.id);
  refresh();
}
