"use client";

import { useState, useCallback } from "react";

type UseKudoLikeOptions = {
  kudoId: string;
  initialLiked: boolean;
  initialCount: number;
};

type UseKudoLikeReturn = {
  liked: boolean;
  heartCount: number;
  toggling: boolean;
  error: string | null;
  toggle: () => void;
};

export function useKudoLike({
  kudoId,
  initialLiked,
  initialCount,
}: UseKudoLikeOptions): UseKudoLikeReturn {
  const [liked, setLiked] = useState(initialLiked);
  const [heartCount, setHeartCount] = useState(initialCount);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async () => {
    if (toggling) return;

    // Optimistic update
    const prevLiked = liked;
    const prevCount = heartCount;
    setLiked(!liked);
    setHeartCount(liked ? heartCount - 1 : heartCount + 1);
    setToggling(true);
    setError(null);

    try {
      const res = await fetch(`/api/kudos/${kudoId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      const data = (await res.json()) as { liked: boolean; heart_count: number };
      setLiked(data.liked);
      setHeartCount(data.heart_count);
    } catch {
      // Rollback
      setLiked(prevLiked);
      setHeartCount(prevCount);
      setError("Không thể thả tim. Thử lại sau.");
    } finally {
      setToggling(false);
    }
  }, [kudoId, liked, heartCount, toggling]);

  return { liked, heartCount, toggling, error, toggle };
}
