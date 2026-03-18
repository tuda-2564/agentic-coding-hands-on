import { createClient } from "@/libs/supabase/server";
import type { KudoHighlight } from "@/types/kudos";

type FeedResult = {
  kudos: KudoHighlight[];
  nextCursor: string | null;
};

export async function getKudosFeed(
  cursor?: string,
  limit: number = 10,
  hashtag?: string,
  userId?: string
): Promise<FeedResult> {
  const supabase = await createClient();

  let query = supabase
    .from("kudos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  if (hashtag) {
    query = query.contains("hashtags", [hashtag]);
  }

  const { data: kudos, error } = await query;

  if (error || !kudos) {
    return { kudos: [], nextCursor: null };
  }

  const hasMore = kudos.length > limit;
  const pageKudos = hasMore ? kudos.slice(0, limit) : kudos;
  const nextCursor = hasMore
    ? pageKudos[pageKudos.length - 1].created_at
    : null;

  const enriched: KudoHighlight[] = await Promise.all(
    pageKudos.map(async (kudo) => {
      const { data: senderProfile } = await supabase
        .from("user_profiles")
        .select("full_name, avatar_url")
        .eq("id", kudo.sender_id)
        .single();

      const recipientIds: string[] = kudo.recipient_ids ?? [];
      const receivers = await Promise.all(
        recipientIds.map(async (rid: string) => {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("full_name, avatar_url")
            .eq("id", rid)
            .single();
          return {
            user_id: rid,
            full_name: profile?.full_name ?? "Unknown",
            avatar_url: profile?.avatar_url ?? null,
          };
        })
      );

      let isLikedByMe = false;
      if (userId) {
        const { data: like } = await supabase
          .from("kudo_likes")
          .select("id")
          .eq("kudo_id", kudo.id)
          .eq("user_id", userId)
          .maybeSingle();
        isLikedByMe = !!like;
      }

      return {
        ...kudo,
        content: kudo.content ?? kudo.message ?? "",
        heart_count: kudo.heart_count ?? 0,
        sender_full_name: senderProfile?.full_name ?? "Unknown",
        sender_avatar_url: senderProfile?.avatar_url ?? null,
        receivers,
        is_liked_by_me: isLikedByMe,
      };
    })
  );

  return { kudos: enriched, nextCursor };
}
