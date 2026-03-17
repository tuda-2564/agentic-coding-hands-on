import { createClient } from "@/libs/supabase/server";
import type { Campaign } from "@/types/campaign";

export async function getActiveCampaign(): Promise<Campaign | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Campaign;
}
