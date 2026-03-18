import { createClient } from "@/libs/supabase/server";
import type { KudoStats } from "@/types/kudos";

export async function getKudoStats(userId: string): Promise<KudoStats> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_kudo_stats", {
    p_user_id: userId,
  });

  if (error || !data) {
    return {
      kudos_received: 0,
      kudos_sent: 0,
      hearts_received: 0,
      secret_boxes_opened: 0,
      secret_boxes_unopened: 0,
    };
  }

  return data as KudoStats;
}
