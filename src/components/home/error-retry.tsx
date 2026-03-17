"use client";

import { useRouter } from "next/navigation";

type ErrorRetryProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorRetry({
  message = "Something went wrong.",
  onRetry,
}: ErrorRetryProps) {
  const router = useRouter();

  function handleRetry() {
    if (onRetry) {
      onRetry();
    } else {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gold/30 bg-surface-card p-6 text-center">
      <p className="text-sm text-[#B0BEC5]">{message}</p>
      <button
        type="button"
        onClick={handleRetry}
        className="rounded-md bg-gold px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-gold-light focus:outline-2 focus:outline-offset-2 focus:outline-gold"
      >
        Try again
      </button>
    </div>
  );
}
