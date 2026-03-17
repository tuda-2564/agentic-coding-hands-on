import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";

function isSafeRedirect(next: string | null): boolean {
  if (!next) return false;
  // Must be a relative path starting with /
  // Must not contain // (protocol-relative) or a protocol (http:, https:)
  return (
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !/^\/[^/]*:/.test(next) &&
    !/https?:/.test(next)
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectTo = isSafeRedirect(next) ? next! : "/";
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
