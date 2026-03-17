import { describe, it, expect } from "vitest";
import { formatVND } from "../format";

describe("formatVND", () => {
  it("formats a standard amount", () => {
    expect(formatVND(7000000)).toBe("7,000,000 VND");
  });

  it("formats zero", () => {
    expect(formatVND(0)).toBe("0 VND");
  });

  it("formats a small amount", () => {
    expect(formatVND(500)).toBe("500 VND");
  });

  it("formats a large amount", () => {
    expect(formatVND(15000000)).toBe("15,000,000 VND");
  });

  it("formats negative amounts", () => {
    expect(formatVND(-1000000)).toBe("-1,000,000 VND");
  });

  it("truncates decimals", () => {
    expect(formatVND(7000000.99)).toBe("7,000,001 VND");
  });
});
