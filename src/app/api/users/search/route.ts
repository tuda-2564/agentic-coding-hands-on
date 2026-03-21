import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/libs/supabase/server";
import { searchUsers } from "@/services/users";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";


export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters", field: "q" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
      }
    );
  }

  const serviceClient = createServiceRoleClient();
  const colleagues = await searchUsers(q, serviceClient);

  return NextResponse.json(colleagues, {
    headers: {
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
