import { describe, it, expect } from "vitest";
import { AWARD_CATEGORIES } from "@/utils/award-data";

describe("AWARD_CATEGORIES", () => {
  it("contains exactly 6 categories", () => {
    expect(AWARD_CATEGORIES).toHaveLength(6);
  });

  it("has all required fields as non-empty values", () => {
    for (const category of AWARD_CATEGORIES) {
      expect(category.id).toBeTruthy();
      expect(category.name).toBeTruthy();
      expect(category.description).toBeTruthy();
      expect(category.imageUrl).toBeTruthy();
      expect(category.quantity).toBeGreaterThan(0);
      expect(category.unitType).toBeTruthy();
      expect(category.prizeTiers.length).toBeGreaterThan(0);
    }
  });

  it("has URL-safe ids (lowercase, hyphenated, no spaces)", () => {
    for (const category of AWARD_CATEGORIES) {
      expect(category.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has unique ids", () => {
    const ids = AWARD_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is in correct display order", () => {
    const names = AWARD_CATEGORIES.map((c) => c.name);
    expect(names).toEqual([
      "Top Talent",
      "Top Project",
      "Top Project Leader",
      "Best Manager",
      "Signature 2025 - Creator",
      "MVP (Most Valuable Person)",
    ]);
  });

  it("Signature 2025 has exactly 2 prize tiers", () => {
    const signature = AWARD_CATEGORIES.find((c) => c.id === "signature-2025");
    expect(signature).toBeDefined();
    expect(signature!.prizeTiers).toHaveLength(2);
    expect(signature!.prizeTiers[0].label).toContain("cá nhân");
    expect(signature!.prizeTiers[1].label).toContain("tập thể");
  });

  it("all non-Signature categories have exactly 1 prize tier", () => {
    const others = AWARD_CATEGORIES.filter((c) => c.id !== "signature-2025");
    for (const category of others) {
      expect(category.prizeTiers).toHaveLength(1);
    }
  });

  it("prize tier values contain VNĐ", () => {
    for (const category of AWARD_CATEGORIES) {
      for (const tier of category.prizeTiers) {
        expect(tier.value).toContain("VNĐ");
      }
    }
  });
});
