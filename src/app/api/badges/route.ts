import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getBadges } from "@/services/badges";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const runtime = "edge";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const badges = await getBadges();

  return NextResponse.json(badges, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
