import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCountdown } from "../use-countdown";

describe("useCountdown", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns correct time left for a future date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-01T00:00:00Z"));

    const { result } = renderHook(() =>
      useCountdown("2025-12-02T05:30:45Z")
    );

    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(5);
    expect(result.current.minutes).toBe(30);
    expect(result.current.seconds).toBe(45);
    expect(result.current.isExpired).toBe(false);
  });

  it("returns isExpired=true for a past date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-02T00:00:00Z"));

    const { result } = renderHook(() =>
      useCountdown("2025-12-01T00:00:00Z")
    );

    expect(result.current.isExpired).toBe(true);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it("updates every second", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-01T00:00:00Z"));

    const { result } = renderHook(() =>
      useCountdown("2025-12-01T00:00:05Z")
    );

    expect(result.current.seconds).toBe(5);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(4);
  });

  it("cleans up interval on unmount", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-01T00:00:00Z"));
    const clearSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() =>
      useCountdown("2025-12-02T00:00:00Z")
    );

    unmount();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
