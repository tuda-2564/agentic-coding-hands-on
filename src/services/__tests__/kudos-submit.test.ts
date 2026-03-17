import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitKudo } from "@/services/kudos-submit";
import type { KudoSubmitPayload, Kudo } from "@/types/kudos";

const makePayload = (overrides: Partial<KudoSubmitPayload> = {}): KudoSubmitPayload & { recipient_full_names: string[] } => ({
  recipient_ids: ["user-1", "user-2"],
  recipient_full_names: ["Alice Smith", "Bob Jones"],
  badge_id: "badge-1",
  content: '<p>Great work <span data-mention-id="user-1">@Alice</span>!</p>',
  hashtags: ["teamwork"],
  image_urls: [],
  ...overrides,
});

const mockKudo: Kudo = {
  id: "kudo-1",
  sender_id: "sender-1",
  receiver_id: "user-1",
  message: "<p>Great work</p>",
  created_at: "2026-03-12T00:00:00Z",
  recipient_ids: ["user-1", "user-2"],
  badge_id: "badge-1",
  hashtags: ["teamwork"],
  image_urls: [],
};

describe("submitKudo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts a kudos row and returns the created Kudo", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockKudo, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockNotifInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn((table: string) => {
      if (table === "kudos") return { insert: mockInsert };
      return { insert: mockNotifInsert };
    });
    const mockSupabase = {
      from: mockFrom,
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sender-1" } } }) },
    };

    const result = await submitKudo(makePayload(), mockSupabase as never);

    expect(mockFrom).toHaveBeenCalledWith("kudos");
    expect(result).toEqual(mockKudo);
  });

  it("populates receiver_id with recipient_ids[0] for backward compat", async () => {
    let insertedRow: Record<string, unknown> = {};
    const mockSingle = vi.fn().mockResolvedValue({ data: mockKudo, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn((row: Record<string, unknown>) => {
      insertedRow = row;
      return { select: mockSelect };
    });
    const mockNotifInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn((table: string) => {
      if (table === "kudos") return { insert: mockInsert };
      return { insert: mockNotifInsert };
    });
    const mockSupabase = {
      from: mockFrom,
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sender-1" } } }) },
    };

    await submitKudo(makePayload(), mockSupabase as never);

    expect(insertedRow).toMatchObject({
      receiver_id: "user-1",
      receiver_name: "Alice Smith",
    });
  });

  it("bulk-inserts notification rows for extracted mention IDs", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockKudo, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockKudoInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockNotifInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn((table: string) => {
      if (table === "kudos") return { insert: mockKudoInsert };
      return { insert: mockNotifInsert };
    });
    const mockSupabase = {
      from: mockFrom,
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sender-1" } } }) },
    };

    await submitKudo(makePayload(), mockSupabase as never);

    // content has data-mention-id="user-1" → one notification
    expect(mockFrom).toHaveBeenCalledWith("notifications");
    expect(mockNotifInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ user_id: "user-1", kudo_id: "kudo-1", type: "mention" }),
      ])
    );
  });

  it("throws an error when kudos insert fails", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" } }),
    });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
    const mockSupabase = {
      from: mockFrom,
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sender-1" } } }) },
    };

    await expect(submitKudo(makePayload(), mockSupabase as never)).rejects.toThrow();
  });

  it("does not insert notifications when content has no mentions", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockKudo, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockKudoInsert = vi.fn().mockReturnValue({ select: mockSelect });
    const mockNotifInsert = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn((table: string) => {
      if (table === "kudos") return { insert: mockKudoInsert };
      return { insert: mockNotifInsert };
    });
    const mockSupabase = {
      from: mockFrom,
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "sender-1" } } }) },
    };

    await submitKudo(
      makePayload({ content: "<p>No mentions here</p>" }),
      mockSupabase as never
    );

    // notifications insert should NOT be called when there are no mentions
    expect(mockFrom).not.toHaveBeenCalledWith("notifications");
  });
});

// ── OWASP XSS test cases (T042) ──────────────────────────────────────────────
// These verify that the sanitize-html step in POST /api/kudos blocks XSS.
// submitKudo itself receives already-sanitised content; these tests call
// the sanitiser directly to confirm it strips known XSS vectors.
import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["b", "i", "u", "ul", "ol", "li", "p", "br", "span"],
  allowedAttributes: {
    span: ["data-mention-id", "data-type", "class"],
  },
};

describe("sanitize-html — OWASP XSS payloads", () => {
  it("strips <script> tags from content", () => {
    const payload = '<p>Hello</p><script>alert("xss")</script>';
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
    expect(result).toContain("<p>Hello</p>");
  });

  it("strips onerror attribute from HTML", () => {
    const payload = '<p><img onerror="alert(1)" src="x" /></p>';
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert");
  });

  it("strips javascript: protocol from href", () => {
    const payload = '<p><a href="javascript:alert(1)">click</a></p>';
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).not.toContain("javascript:");
  });

  it("strips onclick event handlers", () => {
    const payload = '<p onclick="alert(1)">text</p>';
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).not.toContain("onclick");
    expect(result).toContain("<p>");
  });

  it("preserves allowed formatting tags", () => {
    const payload = "<p><b>bold</b> <i>italic</i> <u>underline</u></p>";
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).toContain("<b>bold</b>");
    expect(result).toContain("<i>italic</i>");
    expect(result).toContain("<u>underline</u>");
  });

  it("preserves mention spans with data-mention-id", () => {
    const payload = '<span data-mention-id="uuid-1">@Alice</span>';
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).toContain('data-mention-id="uuid-1"');
    expect(result).toContain("@Alice");
  });

  it("strips span attributes other than data-mention-id", () => {
    const payload = '<span data-mention-id="u1" style="color:red">@Alice</span>';
    const result = sanitizeHtml(payload, SANITIZE_OPTIONS);
    expect(result).not.toContain("style=");
    expect(result).toContain('data-mention-id="u1"');
  });
});
