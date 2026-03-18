import { createClient } from "@/libs/supabase/server";
import type { SunnerGift, SunnerRanking } from "@/types/kudos";

export async function getGiftRecipients(): Promise<SunnerGift[]> {
  const supabase = await createClient();

  const { data: boxes, error } = await supabase
    .from("secret_boxes")
    .select("user_id, gift_description, created_at")
    .eq("opened", true)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !boxes) {
    return [];
  }

  const enriched: SunnerGift[] = await Promise.all(
    boxes.map(async (box) => {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, avatar_url")
        .eq("id", box.user_id)
        .single();

      return {
        user_id: box.user_id,
        full_name: profile?.full_name ?? "Unknown",
        avatar_url: profile?.avatar_url ?? null,
        description: box.gift_description ?? "",
      };
    })
  );

  return enriched;
}

export async function getSunnerRankings(): Promise<SunnerRanking[]> {
  const supabase = await createClient();

  // Get top 10 users by recent kudos received count
  const { data: kudos, error } = await supabase
    .from("kudos")
    .select("recipient_ids")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !kudos) {
    return [];
  }

  // Count kudos per recipient
  const countMap = new Map<string, number>();
  for (const kudo of kudos) {
    const ids: string[] = kudo.recipient_ids ?? [];
    for (const id of ids) {
      countMap.set(id, (countMap.get(id) ?? 0) + 1);
    }
  }

  // Sort by count, take top 10
  const topUsers = Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const rankings: SunnerRanking[] = await Promise.all(
    topUsers.map(async ([userId, count]) => {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

      return {
        user_id: userId,
        full_name: profile?.full_name ?? "Unknown",
        avatar_url: profile?.avatar_url ?? null,
        rank_change: `+${count} kudos`,
      };
    })
  );

  return rankings;
}
