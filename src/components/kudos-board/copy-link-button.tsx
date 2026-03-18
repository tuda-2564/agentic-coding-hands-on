"use client";

import Icon from "@/components/ui/icon";
import { useClipboard } from "@/hooks/use-clipboard";

type CopyLinkButtonProps = {
  kudoId: string;
};

export default function CopyLinkButton({ kudoId }: CopyLinkButtonProps) {
  const { copied, copy } = useClipboard();

  const handleCopy = () => {
    const url = `${window.location.origin}/kudos#${kudoId}`;
    copy(url);
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 text-sm font-medium text-navy cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Icon name="link" size={16} />
        <span>Copy Link</span>
      </button>
      {copied && (
        <span
          aria-live="polite"
          className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-medium text-kudos-gold bg-navy/90 px-2 py-1 rounded whitespace-nowrap animate-[fadeUp_200ms_ease-out]"
        >
          Link copied — ready to share!
        </span>
      )}
    </div>
  );
}
