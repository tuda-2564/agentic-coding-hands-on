import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import PrelaunchCountdown from "@/components/countdown/prelaunch-countdown";

// Mock next/font/local
vi.mock("next/font/local", () => ({
  default: () => ({ variable: "font-digital-mock" }),
}));

// Mock next/navigation
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} data-fill={fill} data-priority={priority} />;
  },
}));

// Mock useCountdown
const mockUseCountdown = vi.fn();
vi.mock("@/hooks/use-countdown", () => ({
  useCountdown: (...args: unknown[]) => mockUseCountdown(...args),
}));

describe("PrelaunchCountdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCountdown.mockReturnValue({
      days: 5,
      hours: 12,
      minutes: 30,
      seconds: 0,
      isExpired: false,
    });
  });

  it("renders the title text", () => {
    render(<PrelaunchCountdown eventDate="2026-04-01T00:00:00Z" />);
    expect(
      screen.getByText("Sự kiện sẽ bắt đầu sau")
    ).toBeInTheDocument();
  });

  it("renders three countdown units with correct labels", () => {
    render(<PrelaunchCountdown eventDate="2026-04-01T00:00:00Z" />);
    expect(screen.getByText("DAYS")).toBeInTheDocument();
    expect(screen.getByText("HOURS")).toBeInTheDocument();
    expect(screen.getByText("MINUTES")).toBeInTheDocument();
  });

  it("displays correct countdown values as individual digits", () => {
    mockUseCountdown.mockReturnValue({
      days: 5,
      hours: 3,
      minutes: 20,
      seconds: 0,
      isExpired: false,
    });
    render(<PrelaunchCountdown eventDate="2026-04-01T00:00:00Z" />);
    // Days: 05 → "0" and "5"
    // Hours: 03 → "0" and "3"
    // Minutes: 20 → "2" and "0"
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(3); // one from days tens, one from hours tens, one from minutes ones
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("has timer role and aria-live for accessibility", () => {
    render(<PrelaunchCountdown eventDate="2026-04-01T00:00:00Z" />);
    const timer = screen.getByRole("timer");
    expect(timer).toBeInTheDocument();
    expect(timer).toHaveAttribute("aria-live", "polite");
  });

  it("calls router.refresh when countdown expires", () => {
    mockUseCountdown.mockReturnValue({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    });
    render(<PrelaunchCountdown eventDate="2026-03-13T00:00:00Z" />);
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("does not call router.refresh when countdown is active", () => {
    render(<PrelaunchCountdown eventDate="2026-04-01T00:00:00Z" />);
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
