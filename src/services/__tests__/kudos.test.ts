import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRecentKudos } from "../kudos";

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();

vi.mock("@/libs/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: mockSelect,
    })),
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockSelect.mockReturnValue({ order: mockOrder });
  mockOrder.mockReturnValue({ limit: mockLimit });
});

describe("getRecentKudos", () => {
  it("returns kudos ordered by created_at desc", async () => {
    const kudos = [
      { id: "1", message: "Great work!", created_at: "2025-12-02T00:00:00Z" },
      { id: "2", message: "Thank you!", created_at: "2025-12-01T00:00:00Z" },
    ];
    mockLimit.mockResolvedValue({ data: kudos, error: null });

    const result = await getRecentKudos();

    expect(result).toEqual(kudos);
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(mockLimit).toHaveBeenCalledWith(20);
  });

  it("respects custom limit param", async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });

    await getRecentKudos(5);

    expect(mockLimit).toHaveBeenCalledWith(5);
  });

  it("returns empty array on error", async () => {
    mockLimit.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const result = await getRecentKudos();

    expect(result).toEqual([]);
  });
});
