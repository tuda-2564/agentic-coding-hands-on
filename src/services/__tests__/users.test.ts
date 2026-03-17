import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchUsers } from "@/services/users";
import type { Colleague } from "@/types/kudos";

describe("searchUsers", () => {
  const mockColleagues: Colleague[] = [
    { id: "u1", full_name: "Alice Smith", avatar_url: null },
    { id: "u2", full_name: "Bob Jones", avatar_url: "https://example.com/bob.png" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Colleague[] matching the query", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ data: mockColleagues, error: null });
    const mockIlike = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    const mockServiceClient = { from: mockFrom };

    const result = await searchUsers("alice", mockServiceClient as never);

    expect(mockFrom).toHaveBeenCalledWith("user_profiles");
    expect(mockSelect).toHaveBeenCalledWith("id, full_name, avatar_url");
    expect(mockIlike).toHaveBeenCalledWith("full_name", "%alice%");
    expect(mockLimit).toHaveBeenCalledWith(20);
    expect(result).toEqual(mockColleagues);
  });

  it("returns empty array when query is empty string", async () => {
    const mockServiceClient = { from: vi.fn() };

    const result = await searchUsers("", mockServiceClient as never);

    expect(result).toEqual([]);
    expect(mockServiceClient.from).not.toHaveBeenCalled();
  });

  it("returns max 20 results", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ data: mockColleagues, error: null });
    const mockIlike = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    const mockServiceClient = { from: mockFrom };

    await searchUsers("bob", mockServiceClient as never);

    expect(mockLimit).toHaveBeenCalledWith(20);
  });

  it("returns empty array on Supabase error", async () => {
    const mockLimit = vi.fn().mockResolvedValue({ data: null, error: { message: "error" } });
    const mockIlike = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
    const mockServiceClient = { from: mockFrom };

    const result = await searchUsers("test", mockServiceClient as never);

    expect(result).toEqual([]);
  });
});
