import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAwardCategories } from "../awards";

const mockSelect = vi.fn();
const mockOrder = vi.fn();

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
});

describe("getAwardCategories", () => {
  it("returns sorted array of award categories", async () => {
    const categories = [
      { id: "1", name: "Top Talent", sort_order: 1 },
      { id: "2", name: "Best Manager", sort_order: 2 },
    ];
    mockOrder.mockResolvedValue({ data: categories, error: null });

    const result = await getAwardCategories();

    expect(result).toEqual(categories);
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockOrder).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("returns empty array when no categories exist", async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    const result = await getAwardCategories();

    expect(result).toEqual([]);
  });

  it("returns empty array on error", async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    const result = await getAwardCategories();

    expect(result).toEqual([]);
  });
});
