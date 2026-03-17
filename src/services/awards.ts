import { createClient } from "@/libs/supabase/server";
import type { AwardCategory } from "@/types/awards";

export async function getAwardCategories(): Promise<AwardCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("award_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as AwardCategory[];
}
