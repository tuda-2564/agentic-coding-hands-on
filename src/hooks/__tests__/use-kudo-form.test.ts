import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useKudoForm } from "@/hooks/use-kudo-form";
import type { Colleague, Badge } from "@/types/kudos";

const mockColleague: Colleague = {
  id: "user-1",
  full_name: "Alice Smith",
  avatar_url: null,
};

const mockBadge: Badge = {
  id: "badge-1",
  name: "Star Performer",
  icon_url: null,
  description: null,
};

const mockOnSuccess = vi.fn();

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock Supabase browser client
vi.mock("@/libs/supabase/client", () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: "user-1/test.jpg" }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://cdn.example.com/test.jpg" } }),
      })),
    },
  })),
}));

describe("useKudoForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initialises with empty state", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    expect(result.current.recipients).toEqual([]);
    expect(result.current.selectedBadge).toBeNull();
    expect(result.current.content).toBe("");
    expect(result.current.hashtags).toEqual([]);
    expect(result.current.images).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });

  it("addRecipient adds a colleague to recipients", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    expect(result.current.recipients).toEqual([mockColleague]);
  });

  it("removeRecipient removes a colleague by id", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.removeRecipient("user-1"));
    expect(result.current.recipients).toEqual([]);
  });

  it("setBadge sets the selected badge", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.setBadge(mockBadge));
    expect(result.current.selectedBadge).toEqual(mockBadge);
  });

  it("setContent updates content", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.setContent("<p>Hello</p>"));
    expect(result.current.content).toBe("<p>Hello</p>");
  });

  it("addHashtag adds a hashtag", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addHashtag("teamwork"));
    expect(result.current.hashtags).toEqual(["teamwork"]);
  });

  it("removeHashtag removes a hashtag by value", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addHashtag("teamwork"));
    act(() => result.current.removeHashtag("teamwork"));
    expect(result.current.hashtags).toEqual([]);
  });

  it("submit sets fieldErrors when recipients is empty", async () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.setBadge(mockBadge));
    act(() => result.current.setContent("<p>Some content</p>"));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.recipients).toBeDefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submit sets fieldErrors when badge is not selected", async () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setContent("<p>Some content</p>"));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.badge).toBeDefined();
  });

  it("submit sets fieldErrors when content is empty", async () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setBadge(mockBadge));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.content).toBeDefined();
  });

  it("isSubmitting prevents double-submit", async () => {
    vi.mocked(global.fetch).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(new Response(JSON.stringify({ id: "k1" }), { status: 201 })), 200))
    );

    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setBadge(mockBadge));
    act(() => result.current.setContent("<p>Hello</p>"));

    // Start submit but don't await — immediately try second submit
    act(() => { result.current.submit(); });

    expect(result.current.isSubmitting).toBe(true);
    // Second submit should be a no-op
    await act(async () => result.current.submit());

    // fetch should have been called only once
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("handles 401 response by redirecting to /login", async () => {
    const mockPush = vi.fn();
    vi.doMock("next/navigation", () => ({
      useRouter: () => ({ push: mockPush }),
    }));

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    );

    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setBadge(mockBadge));
    act(() => result.current.setContent("<p>Hello</p>"));

    await act(async () => result.current.submit());

    expect(result.current.isSubmitting).toBe(false);
  });

  it("handles 422 response by populating fieldErrors from response body", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          errors: [{ field: "recipient_ids", message: "Vui lòng chọn ít nhất một người nhận" }],
        }),
        { status: 422 }
      )
    );

    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setBadge(mockBadge));
    act(() => result.current.setContent("<p>Hello</p>"));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.recipient_ids).toBe(
      "Vui lòng chọn ít nhất một người nhận"
    );
  });

  it("calls onSuccess on successful submit", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "kudo-1" }), { status: 201 })
    );

    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setBadge(mockBadge));
    act(() => result.current.setContent("<p>Hello</p>"));

    await act(async () => result.current.submit());

    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
  });

  it("reset clears all state", () => {
    const { result } = renderHook(() => useKudoForm({ onSuccess: mockOnSuccess }));
    act(() => result.current.addRecipient(mockColleague));
    act(() => result.current.setBadge(mockBadge));
    act(() => result.current.setContent("<p>Hello</p>"));
    act(() => result.current.addHashtag("teamwork"));

    act(() => result.current.reset());

    expect(result.current.recipients).toEqual([]);
    expect(result.current.selectedBadge).toBeNull();
    expect(result.current.content).toBe("");
    expect(result.current.hashtags).toEqual([]);
  });
});
