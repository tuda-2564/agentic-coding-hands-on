"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
};

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium text-white max-w-sm animate-in slide-in-from-top-2 duration-200 ${
        type === "success"
          ? "bg-surface-card border-gold"
          : "bg-surface-card border-[#EF4444]"
      }`}
    >
      <span
        className={`text-base ${type === "success" ? "text-gold" : "text-[#EF4444]"}`}
      >
        {type === "success" ? "✓" : "✗"}
      </span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-auto text-[#6B8A9A] hover:text-white transition-colors"
        aria-label="Đóng thông báo"
      >
        ×
      </button>
    </div>
  );
}
