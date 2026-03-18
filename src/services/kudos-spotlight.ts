import { createClient } from "@/libs/supabase/server";
import type { SpotlightEntry } from "@/types/kudos";

type SpotlightData = {
  total: number;
  entries: SpotlightEntry[];
};

export async function getSpotlightData(): Promise<SpotlightData> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_spotlight_data");

  if (error || !data) {
    return { total: 0, entries: [] };
  }

  return data as SpotlightData;
}
