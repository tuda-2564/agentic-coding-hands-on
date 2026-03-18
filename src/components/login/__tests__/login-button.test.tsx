import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LoginButton from "@/components/login/login-button";

// Mock next/navigation
const mockGet = vi.fn().mockReturnValue(null);
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock Supabase client
const mockSignInWithOAuth = vi.fn().mockResolvedValue({ data: {}, error: null });
vi.mock("@/libs/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

describe("LoginButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders button with text 'LOGIN With Google' and Google icon", () => {
    render(<LoginButton />);
    expect(screen.getByText("LOGIN With Google")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login with google/i })).toBeInTheDocument();
    expect(screen.getByAltText("")).toBeInTheDocument(); // Google icon with empty alt
  });

  it("calls signInWithOAuth with google provider on click", async () => {
    render(<LoginButton />);
    fireEvent.click(screen.getByRole("button", { name: /login with google/i }));

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: expect.stringContaining("/auth/callback"),
      },
    });
  });

  it("shows loading state on click (disabled + aria-busy)", async () => {
    render(<LoginButton />);
    const button = screen.getByRole("button", { name: /login with google/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("prevents duplicate signInWithOAuth calls on double-click", async () => {
    render(<LoginButton />);
    const button = screen.getByRole("button", { name: /login with google/i });

    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockSignInWithOAuth).toHaveBeenCalledTimes(1);
  });

  it("displays error message for ?error=auth_error", () => {
    render(<LoginButton initialError="auth_error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Đăng nhập thất bại. Vui lòng thử lại.");
  });

  it("displays error message for ?error=access_denied", () => {
    render(<LoginButton initialError="access_denied" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Bạn đã từ chối cấp quyền. Vui lòng thử lại.");
  });

  it("resets isLoading and shows timeout error after 30 seconds", async () => {
    render(<LoginButton />);
    const button = screen.getByRole("button", { name: /login with google/i });

    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(30_000);
    });

    expect(button).not.toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Quá thời gian chờ. Vui lòng thử lại.");
  });

  it("reads error from searchParams when no initialError prop", () => {
    mockGet.mockReturnValue("auth_error");
    render(<LoginButton />);
    expect(screen.getByRole("alert")).toHaveTextContent("Đăng nhập thất bại. Vui lòng thử lại.");
  });

  it("shows generic error for unknown error code", () => {
    render(<LoginButton initialError="unknown_code" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Đã xảy ra lỗi. Vui lòng thử lại.");
  });
});
