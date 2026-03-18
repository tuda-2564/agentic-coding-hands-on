"use client";

import { useRef, useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import HighlightCard from "@/components/kudos-board/highlight-card";
import type { KudoHighlight } from "@/types/kudos";

type KudoCarouselProps = {
  highlights: KudoHighlight[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onHashtagClick?: (hashtag: string) => void;
  onCopyLink?: (kudoId: string) => void;
  onViewDetail?: (kudoId: string) => void;
};

export default function KudoCarousel({
  highlights,
  currentIndex,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onTouchStart,
  onTouchEnd,
  onHashtagClick,
  onCopyLink,
  onViewDetail,
}: KudoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(552);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const firstSlide = trackRef.current.firstElementChild as HTMLElement | null;
      if (firstSlide) {
        setSlideWidth(firstSlide.offsetWidth + 24); // card width + gap
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [highlights.length]);

  if (highlights.length === 0) return null;

  const translateX = -(currentIndex * slideWidth);

  return (
    <div
      className="relative"
      aria-roledescription="carousel"
      aria-label="Highlight Kudos Carousel"
    >
      {/* Side arrows */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="absolute left-4 lg:left-[144px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 cursor-pointer hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors"
        aria-label="Previous slide"
      >
        <Icon name="chevron-left" size={24} className="invert" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="absolute right-4 lg:right-[144px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 cursor-pointer hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors"
        aria-label="Next slide"
      >
        <Icon name="chevron-right" size={24} className="invert" />
      </button>

      {/* Carousel track */}
      <div
        className="overflow-hidden px-4 md:px-12 lg:px-[144px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {highlights.map((kudo, index) => (
            <div
              key={kudo.id}
              role="group"
              aria-label={`Slide ${index + 1} of ${highlights.length}`}
            >
              <HighlightCard
                kudo={kudo}
                onHashtagClick={onHashtagClick}
                onCopyLink={onCopyLink}
                onViewDetail={onViewDetail}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
