"use client";

import { useState, useCallback, useRef } from "react";

type UseCarouselOptions = {
  totalItems: number;
  swipeThreshold?: number;
};

type UseCarouselReturn = {
  currentIndex: number;
  canPrev: boolean;
  canNext: boolean;
  goToNext: () => void;
  goToPrev: () => void;
  goToIndex: (index: number) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  reset: () => void;
};

export function useCarousel({
  totalItems,
  swipeThreshold = 50,
}: UseCarouselOptions): UseCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);

  const maxIndex = Math.max(0, totalItems - 1);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [maxIndex]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > swipeThreshold) {
        if (delta > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    },
    [swipeThreshold, goToNext, goToPrev]
  );

  const reset = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  return {
    currentIndex,
    canPrev,
    canNext,
    goToNext,
    goToPrev,
    goToIndex,
    handleTouchStart,
    handleTouchEnd,
    reset,
  };
}
