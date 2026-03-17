import { NextRequest, NextResponse } from "next/server";
import { getRecentKudos } from "@/services/kudos";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limitParam = searchParams.get("limit");

  let limit = 20;
  if (limitParam) {
    const parsed = parseInt(limitParam, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, 100);
    }
  }

  const kudos = await getRecentKudos(limit);
  return NextResponse.json(kudos);
}
