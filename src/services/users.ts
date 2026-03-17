import type { SupabaseClient } from "@supabase/supabase-js";
import type { Colleague } from "@/types/kudos";

export async function searchUsers(
  query: string,
  serviceRoleClient: SupabaseClient
): Promise<Colleague[]> {
  if (!query) return [];

  const { data, error } = await serviceRoleClient
    .from("user_profiles")
    .select("id, full_name, avatar_url")
    .ilike("full_name", `%${query}%`)
    .limit(20);

  if (error || !data) {
    return [];
  }

  return data as Colleague[];
}
