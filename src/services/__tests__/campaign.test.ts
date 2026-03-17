import { describe, it, expect, vi, beforeEach } from "vitest";
import { getActiveCampaign } from "../campaign";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockSelect.mockReturnValue({ eq: mockEq });
  mockEq.mockReturnValue({ single: mockSingle });
});

describe("getActiveCampaign", () => {
  it("returns campaign when an active one exists", async () => {
    const campaign = {
      id: "1",
      name: "SAA 2025",
      theme: "ROOT FURTHER",
      event_date: "2025-12-15T00:00:00Z",
      description: "Annual awards",
      is_active: true,
      created_at: "2025-01-01T00:00:00Z",
    };
    mockSingle.mockResolvedValue({ data: campaign, error: null });

    const result = await getActiveCampaign();

    expect(result).toEqual(campaign);
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("is_active", true);
  });

  it("returns null when no active campaign exists", async () => {
    mockSingle.mockResolvedValue({ data: null, error: null });

    const result = await getActiveCampaign();

    expect(result).toBeNull();
  });

  it("returns null on error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const result = await getActiveCampaign();

    expect(result).toBeNull();
  });
});
