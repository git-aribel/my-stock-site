"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUSES = new Set(["new", "replied", "closed"]);

export async function setInquiryStatus(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) throw new Error("Not allowed");

  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.has(status)) throw new Error("Bad status");

  const { error } = await createAdminClient()
    .from("service_inquiries")
    .update({ status })
    .eq("id", id);
  if (error) throw error;

  refresh();
}
