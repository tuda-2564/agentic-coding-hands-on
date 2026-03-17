import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KudoModal from "@/components/kudo-modal/kudo-modal";

// Mock child components to focus integration on modal logic
vi.mock("@/components/kudo-modal/recipient-search", () => ({
  default: ({
    recipients,
    onAdd,
    error,
  }: {
    recipients: { id: string; full_name: string }[];
    onAdd: (c: { id: string; full_name: string; avatar_url: null }) => void;
    error?: string;
  }) => (
    <div data-testid="recipient-search">
      <button
        onClick={() => onAdd({ id: "u1", full_name: "Alice", avatar_url: null })}
        data-testid="add-recipient"
      >
        Add
      </button>
      {recipients.map((r) => <span key={r.id}>{r.full_name}</span>)}
      {error && <span data-testid="recipient-error">{error}</span>}
    </div>
  ),
}));

vi.mock("@/components/kudo-modal/badge-selector", () => ({
  default: ({
    onSelect,
    error,
  }: {
    onSelect: (b: { id: string; name: string; icon_url: null; description: null }) => void;
    error?: string;
  }) => (
    <div data-testid="badge-selector">
      <button
        onClick={() => onSelect({ id: "b1", name: "Star", icon_url: null, description: null })}
        data-testid="select-badge"
      >
        Select Badge
      </button>
      {error && <span data-testid="badge-error">{error}</span>}
    </div>
  ),
}));

vi.mock("@/components/kudo-modal/rich-text-editor", () => ({
  default: ({
    onChange,
    error,
  }: {
    onChange: (html: string) => void;
    error?: string;
  }) => (
    <div data-testid="rich-text-editor">
      <button
        onClick={() => onChange("<p>Hello world</p>")}
        data-testid="set-content"
      >
        Set Content
      </button>
      {error && <span data-testid="content-error">{error}</span>}
    </div>
  ),
}));

vi.mock("@/components/kudo-modal/hashtag-input", () => ({
  default: () => <div data-testid="hashtag-input" />,
}));

vi.mock("@/components/kudo-modal/image-upload", () => ({
  default: () => <div data-testid="image-upload" />,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/libs/supabase/client", () => ({
  createClient: vi.fn(() => ({
    storage: { from: vi.fn(() => ({ upload: vi.fn(), getPublicUrl: vi.fn() })) },
  })),
}));

describe("KudoModal", () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders modal when isOpen is true", () => {
    render(<KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Gửi lời cảm ơn/ })).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<KudoModal isOpen={false} onClose={onClose} onSuccess={onSuccess} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when Hủy button is clicked", async () => {
    render(<KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    await userEvent.click(screen.getByText("Hủy"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const { container } = render(
      <KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />
    );
    // The backdrop is the outer div
    const backdrop = container.firstChild as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows field errors when submitting with empty form", async () => {
    render(<KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    await userEvent.click(screen.getByText("Gửi ►"));

    await waitFor(() => {
      expect(screen.getByTestId("recipient-error")).toBeInTheDocument();
      expect(screen.getByTestId("badge-error")).toBeInTheDocument();
      expect(screen.getByTestId("content-error")).toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls fetch and onSuccess on valid submit", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ id: "kudo-1" }), { status: 201 })
    );

    render(<KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);

    // Fill in required fields via mock buttons
    await userEvent.click(screen.getByTestId("add-recipient"));
    await userEvent.click(screen.getByTestId("select-badge"));
    await userEvent.click(screen.getByTestId("set-content"));

    await userEvent.click(screen.getByText("Gửi ►"));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows submit error on API failure", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
    );

    render(<KudoModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    await userEvent.click(screen.getByTestId("add-recipient"));
    await userEvent.click(screen.getByTestId("select-badge"));
    await userEvent.click(screen.getByTestId("set-content"));

    await userEvent.click(screen.getByText("Gửi ►"));

    await waitFor(() =>
      expect(screen.getByText(/Gửi kudo thất bại/)).toBeInTheDocument()
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
