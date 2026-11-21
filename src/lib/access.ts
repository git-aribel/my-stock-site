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

// True when the person viewing the page is a paying member (or admin)
export async function viewerIsMember(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { loggedIn: false, member: false };
  return { loggedIn: true, member: await hasDownloadAccess(supabase, user.id) };
}
