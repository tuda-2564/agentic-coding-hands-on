import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import { getHighlightKudos } from "@/services/kudos-highlight";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
};

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get("hashtag") ?? undefined;
  const department = searchParams.get("department") ?? undefined;

  try {
    const highlights = await getHighlightKudos(
      { hashtag, department },
      user.id
    );
    return NextResponse.json(highlights, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
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
