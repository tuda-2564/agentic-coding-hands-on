import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DigitCard from "@/components/countdown/digit-card";

describe("DigitCard", () => {
  it("renders the digit text", () => {
    render(<DigitCard digit="5" />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders a different digit", () => {
    render(<DigitCard digit="0" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("applies glass-morphism styles", () => {
    const { container } = render(<DigitCard digit="3" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("backdrop-blur-[25px]");
    expect(card.className).toContain("rounded-xl");
    expect(card.className).toContain("border-[0.75px]");
  });

  it("applies font-digital class to digit text", () => {
    render(<DigitCard digit="7" />);
    const text = screen.getByText("7");
    expect(text.className).toContain("font-digital");
  });
});
