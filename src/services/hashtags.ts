import { createClient } from "@/libs/supabase/server";

export async function getHashtags(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("kudos")
    .select("hashtags");

  if (error || !data) {
    return [];
  }

  // Extract unique hashtags from all kudos
  const hashtagSet = new Set<string>();
  for (const kudo of data) {
    const tags: string[] = kudo.hashtags ?? [];
    for (const tag of tags) {
      hashtagSet.add(tag);
    }
  }

  return Array.from(hashtagSet).sort();
}
