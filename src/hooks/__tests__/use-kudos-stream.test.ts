import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKudosStream } from "../use-kudos-stream";
import type { Kudo } from "@/types/kudos";

const mockOn = vi.fn();
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn();

const mockChannel = {
  on: mockOn,
  subscribe: mockSubscribe,
  unsubscribe: mockUnsubscribe,
};

vi.mock("@/libs/supabase/client", () => ({
  createClient: vi.fn(() => ({
    channel: vi.fn(() => mockChannel),
  })),
}));

const initialKudos: Kudo[] = [
  {
    id: "1",
    sender_id: "a",
    receiver_id: "b",
    message: "Great work!",
    created_at: "2025-12-01T00:00:00Z",
    sender_name: "Alice",
    receiver_name: "Bob",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockOn.mockReturnValue(mockChannel);
  mockSubscribe.mockImplementation((callback) => {
    if (callback) callback("SUBSCRIBED");
    return mockChannel;
  });
});

describe("useKudosStream", () => {
  it("initializes with provided kudos", () => {
    const { result } = renderHook(() => useKudosStream(initialKudos));

    expect(result.current.kudos).toEqual(initialKudos);
  });

  it("subscribes to kudos channel on mount", () => {
    renderHook(() => useKudosStream(initialKudos));

    expect(mockOn).toHaveBeenCalledWith(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "kudos" },
      expect.any(Function)
    );
    expect(mockSubscribe).toHaveBeenCalled();
  });

  it("prepends new kudos on INSERT event", () => {
    let insertCallback: (payload: { new: Kudo }) => void;
    mockOn.mockImplementation((_event, _filter, callback) => {
      insertCallback = callback;
      return mockChannel;
    });

    const { result } = renderHook(() => useKudosStream(initialKudos));

    const newKudo: Kudo = {
      id: "2",
      sender_id: "c",
      receiver_id: "d",
      message: "Thanks!",
      created_at: "2025-12-02T00:00:00Z",
      sender_name: "Charlie",
      receiver_name: "Diana",
    };

    act(() => {
      insertCallback!({ new: newKudo });
    });

    expect(result.current.kudos[0]).toEqual(newKudo);
    expect(result.current.kudos).toHaveLength(2);
  });

  it("returns isConnected flag", () => {
    const { result } = renderHook(() => useKudosStream(initialKudos));

    expect(result.current.isConnected).toBe(true);
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = renderHook(() => useKudosStream(initialKudos));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
