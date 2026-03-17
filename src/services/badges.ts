import { createClient } from "@/libs/supabase/server";
import type { Badge } from "@/types/kudos";

export async function getBadges(): Promise<Badge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("badges").select("*");

  if (error || !data) {
    return [];
  }

  return data as Badge[];
}
