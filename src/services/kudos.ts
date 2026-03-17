import { createClient } from "@/libs/supabase/server";
import type { Kudo } from "@/types/kudos";

export async function getRecentKudos(limit: number = 20): Promise<Kudo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kudos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as Kudo[];
}
