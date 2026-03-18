import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Must use vi.hoisted for variables referenced in vi.mock factory
const mockExchangeCodeForSession = vi.hoisted(() => vi.fn());

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  }),
}));

// Import after mocks
import { GET } from "@/app/auth/callback/route";

function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

describe("GET /auth/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
  });

  it("exchanges code for session and redirects to / on success", async () => {
    const response = await GET(createRequest("/auth/callback?code=valid"));

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("valid");
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
  });

  it("redirects to safe relative path when ?next is provided", async () => {
    const response = await GET(createRequest("/auth/callback?code=valid&next=/awards"));

    expect(new URL(response.headers.get("location")!).pathname).toBe("/awards");
  });

  it("rejects protocol in next param (https://evil.com)", async () => {
    const response = await GET(createRequest("/auth/callback?code=valid&next=https://evil.com"));

    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
  });

  it("rejects protocol-relative next param (//evil.com)", async () => {
    const response = await GET(createRequest("/auth/callback?code=valid&next=//evil.com"));

    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
  });

  it("rejects path with colon in next param (/evil:scheme)", async () => {
    const response = await GET(createRequest("/auth/callback?code=valid&next=/evil:scheme"));

    expect(new URL(response.headers.get("location")!).pathname).toBe("/");
  });

  it("redirects to /login?error=auth_error when no code param", async () => {
    const response = await GET(createRequest("/auth/callback"));

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("error")).toBe("auth_error");
  });

  it("redirects to /login?error=auth_error when exchangeCodeForSession returns error", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: new Error("invalid") });

    const response = await GET(createRequest("/auth/callback?code=invalid"));

    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("error")).toBe("auth_error");
  });
});
