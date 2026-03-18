"use client";

import { useState, useCallback, useRef } from "react";

type UseClipboardReturn = {
  copied: boolean;
  copy: (text: string) => void;
};

export function useClipboard(timeout: number = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), timeout);
        },
        () => {
          // Clipboard write failed — silently ignore
        }
      );
    },
    [timeout]
  );

  return { copied, copy };
}
