import { describe, it, expect, vi, afterEach } from "vitest";
import { calculateTimeLeft } from "../countdown";

describe("calculateTimeLeft", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns positive values for a future date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-01T00:00:00Z"));

    const result = calculateTimeLeft(new Date("2025-12-02T00:00:00Z"));
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it("returns correct hours, minutes, seconds", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-01T00:00:00Z"));

    const result = calculateTimeLeft(new Date("2025-12-01T05:30:45Z"));
    expect(result.days).toBe(0);
    expect(result.hours).toBe(5);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
  });

  it("returns all zeros for a past date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-02T00:00:00Z"));

    const result = calculateTimeLeft(new Date("2025-12-01T00:00:00Z"));
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it("returns all zeros for exactly now", () => {
    vi.useFakeTimers();
    const now = new Date("2025-12-01T12:00:00Z");
    vi.setSystemTime(now);

    const result = calculateTimeLeft(now);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });
});
