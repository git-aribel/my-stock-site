"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Mark a subscriber as unsubscribed (e.g. when they ask by email)
export async function setUnsubscribed(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) throw new Error("Not allowed");

  const id = String(formData.get("id"));
  const unsubscribe = formData.get("unsubscribe") === "1";
  const { error } = await createAdminClient()
    .from("email_subscribers")
    .update({ unsubscribed_at: unsubscribe ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;

  refresh();
}
