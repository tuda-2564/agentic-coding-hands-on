import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBadges } from "@/services/badges";
import type { Badge } from "@/types/kudos";

// Mock the Supabase server client
vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/libs/supabase/server";

const mockBadges: Badge[] = [
  { id: "1", name: "Star Performer", icon_url: "/icons/star.svg", description: "Outstanding work" },
  { id: "2", name: "Team Player", icon_url: "/icons/team.svg", description: "Great collaboration" },
];

describe("getBadges", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Badge[] on success", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: mockBadges, error: null });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await getBadges();

    expect(mockFrom).toHaveBeenCalledWith("badges");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(result).toEqual(mockBadges);
  });

  it("returns empty array when Supabase returns an error", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" } });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await getBadges();

    expect(result).toEqual([]);
  });

  it("returns empty array when Supabase returns null data", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await getBadges();

    expect(result).toEqual([]);
  });
});
