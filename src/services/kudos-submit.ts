import type { SupabaseClient } from "@supabase/supabase-js";
import type { Kudo, KudoSubmitPayload } from "@/types/kudos";
import { extractMentionIds } from "@/utils/mention-parser";

type SubmitPayloadWithNames = KudoSubmitPayload & {
  recipient_full_names: string[];
};

export async function submitKudo(
  payload: SubmitPayloadWithNames,
  supabase: SupabaseClient
): Promise<Kudo> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    recipient_ids,
    recipient_full_names,
    badge_id,
    content,
    hashtags,
    image_urls,
  } = payload;

  // Populate legacy receiver_id / receiver_name for KudosLiveBoard backward compat
  const receiver_id = recipient_ids[0];
  const receiver_name = recipient_full_names[0] ?? null;

  const { data, error } = await supabase
    .from("kudos")
    .insert({
      sender_id: user!.id,
      receiver_id,
      receiver_name,
      recipient_ids,
      badge_id,
      message: content,
      hashtags,
      image_urls,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to insert kudo");
  }

  const kudo = data as Kudo;

  // Bulk-insert @mention notifications
  const mentionedIds = extractMentionIds(content);
  if (mentionedIds.length > 0) {
    const notifications = mentionedIds.map((userId) => ({
      user_id: userId,
      kudo_id: kudo.id,
      type: "mention",
    }));

    await supabase.from("notifications").insert(notifications);
  }

  return kudo;
}
