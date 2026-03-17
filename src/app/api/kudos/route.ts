import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { createClient } from "@/libs/supabase/server";
import { submitKudo } from "@/services/kudos-submit";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
};

// Allowlist for sanitize-html — only safe formatting + mention spans
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["b", "i", "u", "ul", "ol", "li", "p", "br", "span"],
  allowedAttributes: {
    span: ["data-mention-id", "data-type", "class"],
  },
};

export const runtime = "edge";

export async function POST(request: NextRequest) {
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Manual field validation (no Zod)
  const fieldErrors: { field: string; message: string }[] = [];

  const recipientIds = body.recipient_ids;
  if (
    !Array.isArray(recipientIds) ||
    recipientIds.length === 0 ||
    !recipientIds.every((id) => typeof id === "string")
  ) {
    fieldErrors.push({ field: "recipient_ids", message: "Vui lòng chọn ít nhất một người nhận" });
  }

  const recipientFullNames = body.recipient_full_names;
  if (
    !Array.isArray(recipientFullNames) ||
    (recipientFullNames as unknown[]).length === 0
  ) {
    fieldErrors.push({ field: "recipient_full_names", message: "Tên người nhận không hợp lệ" });
  }

  if (typeof body.badge_id !== "string" || !body.badge_id) {
    fieldErrors.push({ field: "badge_id", message: "Vui lòng chọn danh hiệu" });
  }

  if (typeof body.content !== "string" || !body.content.trim()) {
    fieldErrors.push({ field: "content", message: "Vui lòng nhập nội dung kudo" });
  }

  if (fieldErrors.length > 0) {
    return NextResponse.json(
      { errors: fieldErrors },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  // Sanitise rich-text HTML content (XSS prevention — Constitution Principle V)
  const sanitisedContent = sanitizeHtml(body.content as string, SANITIZE_OPTIONS);

  try {
    const kudo = await submitKudo(
      {
        recipient_ids: recipientIds as string[],
        recipient_full_names: recipientFullNames as string[],
        badge_id: body.badge_id as string,
        content: sanitisedContent,
        hashtags: Array.isArray(body.hashtags) ? (body.hashtags as string[]) : [],
        image_urls: Array.isArray(body.image_urls) ? (body.image_urls as string[]) : [],
      },
      supabase
    );

    return NextResponse.json(kudo, {
      status: 201,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
