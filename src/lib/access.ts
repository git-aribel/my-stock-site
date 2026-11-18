import type { SupabaseClient } from "@supabase/supabase-js";

export async function hasDownloadAccess(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (profile?.is_admin) return true;

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"]);

  return (subs ?? []).some(
    (s) =>
      !s.current_period_end ||
      new Date(s.current_period_end).getTime() > Date.now()
  );
}