"use client";

import Icon from "@/components/ui/icon";
import { useKudoLike } from "@/hooks/use-kudo-like";
import { formatHeartCount } from "@/utils/format";

type HeartButtonProps = {
  kudoId: string;
  initialLiked: boolean;
  initialCount: number;
};

export default function HeartButton({
  kudoId,
  initialLiked,
  initialCount,
}: HeartButtonProps) {
  const { liked, heartCount, error, toggle } = useKudoLike({
    kudoId,
    initialLiked,
    initialCount,
  });

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={liked}
        aria-label={`Like kudo, ${heartCount} likes`}
        className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-all"
      >
        <span
          className={`transition-transform duration-200 ease-out ${liked ? "scale-120" : ""}`}
        >
          <Icon
            name="heart"
            size={20}
            className={liked ? "" : "opacity-40 grayscale"}
            alt={liked ? "Liked" : "Not liked"}
          />
        </span>
        <span
          className={`text-base font-bold ${
            liked ? "text-kudos-heart" : "text-[#00101A]"
          }`}
        >
          {formatHeartCount(heartCount)}
        </span>
      </button>
      {error && (
        <span
          aria-live="polite"
          className="absolute -bottom-6 left-0 text-xs text-kudos-error-highlight whitespace-nowrap"
        >
          {error}
        </span>
      )}
    </div>
  );
}
