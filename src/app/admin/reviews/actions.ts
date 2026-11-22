"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUSES = new Set(["pending", "approved", "hidden"]);

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) throw new Error("Not allowed");
}

export async function setReviewStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.has(status)) throw new Error("Bad status");
  const { error } = await createAdminClient().from("reviews").update({ status }).eq("id", id);
  if (error) throw error;
  refresh();
}

export async function removeReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await createAdminClient().from("reviews").delete().eq("id", id);
  if (error) throw error;
  refresh();
}
