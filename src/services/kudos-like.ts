import { createClient } from "@/libs/supabase/server";

type LikeResult = {
  liked: boolean;
  heart_count: number;
};

export async function toggleKudoLike(
  kudoId: string,
  userId: string
): Promise<LikeResult> {
  const supabase = await createClient();

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("kudo_likes")
    .select("id")
    .eq("kudo_id", kudoId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("kudo_likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) {
      throw new Error("Failed to unlike kudo");
    }
  } else {
    // Like
    const { error } = await supabase
      .from("kudo_likes")
      .insert({ user_id: userId, kudo_id: kudoId });

    if (error) {
      throw new Error("Failed to like kudo");
    }
  }

  // Fetch updated heart_count
  const { data: kudo } = await supabase
    .from("kudos")
    .select("heart_count")
    .eq("id", kudoId)
    .single();

  return {
    liked: !existingLike,
    heart_count: kudo?.heart_count ?? 0,
  };
}
