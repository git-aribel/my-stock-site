"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { holdCutoff } from "@/lib/affiliates";

async function requireAdmin() {
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

  return createAdminClient();
}

const STATUSES = new Set(["approved", "rejected", "suspended", "pending"]);

export async function setAffiliateStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.has(status)) throw new Error("Bad status");

  const { error } = await admin
    .from("affiliates")
    .update({
      status,
      approved_at: status === "approved" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;

  refresh();
}

// Marks every commission past the hold period as paid, for one affiliate.
// Call this after you've sent them the money.
export async function markPaid(formData: FormData) {
  const admin = await requireAdmin();
  const affiliateId = String(formData.get("affiliateId"));
  const cutoff = new Date(holdCutoff()).toISOString();

  const { error } = await admin
    .from("affiliate_commissions")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("affiliate_id", affiliateId)
    .eq("status", "pending")
    .lt("created_at", cutoff);
  if (error) throw error;

  refresh();
}
