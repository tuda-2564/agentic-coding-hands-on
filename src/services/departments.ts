import { createClient } from "@/libs/supabase/server";
import type { Department } from "@/types/kudos";

export async function getDepartments(): Promise<Department[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  if (error || !data) {
    return [];
  }

  return data as Department[];
}
