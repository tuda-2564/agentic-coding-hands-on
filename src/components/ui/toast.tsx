"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
};

export default function Toast({ message, type, onDismiss }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const toast = (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium text-white max-w-sm animate-fade-in ${
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

  if (!mounted) return null;
  return createPortal(toast, document.body);
}
