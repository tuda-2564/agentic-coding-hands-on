import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSelector from "@/components/header/language-selector";
import type { Language } from "@/types/auth";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

const languages: Language[] = [
  { code: "VN", label: "Vietnamese", flag: "/icons/flag-vn.svg" },
  { code: "EN", label: "English", flag: "/icons/flag-en.svg" },
];

function renderSelector(props?: { isOpen?: boolean; onToggle?: () => void }) {
  return render(<LanguageSelector languages={languages} {...props} />);
}

describe("LanguageSelector", () => {
  it("renders toggle button with current language", () => {
    renderSelector();
    expect(screen.getByRole("button", { name: /select language, current: vietnamese/i })).toBeInTheDocument();
    expect(screen.getByText("VN")).toBeInTheDocument();
  });

  it("opens dropdown on click, aria-expanded becomes true", () => {
    renderSelector();
    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes dropdown on second click, aria-expanded becomes false", () => {
    renderSelector();
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("selects language option and closes dropdown", () => {
    renderSelector();
    const button = screen.getByRole("button");

    fireEvent.click(button);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[1]); // Click EN

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Select language, current: English");
  });

  it("closes dropdown on outside click without changing selection", () => {
    renderSelector();
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByText("VN")).toBeInTheDocument();
  });

  it("closes dropdown on Escape key", () => {
    renderSelector();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves focus with ArrowDown key (wraps around)", () => {
    renderSelector();
    fireEvent.click(screen.getByRole("button"));

    const options = screen.getAllByRole("option");
    // First option should be focused on open
    expect(document.activeElement).toBe(options[0]);

    // ArrowDown → second option
    fireEvent.keyDown(options[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(options[1]);

    // ArrowDown → wraps to first
    fireEvent.keyDown(options[1], { key: "ArrowDown" });
    expect(document.activeElement).toBe(options[0]);
  });

  it("moves focus with ArrowUp key (wraps around)", () => {
    renderSelector();
    fireEvent.click(screen.getByRole("button"));

    const options = screen.getAllByRole("option");

    // ArrowUp from first → wraps to last
    fireEvent.keyDown(options[0], { key: "ArrowUp" });
    expect(document.activeElement).toBe(options[1]);

    // ArrowUp → back to first
    fireEvent.keyDown(options[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(options[0]);
  });

  it("selects focused option on Enter and closes dropdown", () => {
    renderSelector();
    fireEvent.click(screen.getByRole("button"));

    const options = screen.getAllByRole("option");
    // Navigate to EN
    fireEvent.keyDown(options[0], { key: "ArrowDown" });
    // Press Enter on EN
    fireEvent.keyDown(options[1], { key: "Enter" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
  });

  it("shows currently selected item with aria-selected", () => {
    renderSelector();
    fireEvent.click(screen.getByRole("button"));

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("supports controlled mode (isOpen + onToggle)", () => {
    const onToggle = vi.fn();
    renderSelector({ isOpen: true, onToggle });

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
