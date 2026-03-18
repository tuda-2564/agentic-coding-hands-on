"use client";

import Icon from "@/components/ui/icon";

type CarouselPaginationProps = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export default function CarouselPagination({
  current,
  total,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: CarouselPaginationProps) {
  if (total <= 0) return null;

  return (
    <div
      className="flex items-center justify-center gap-8 h-[52px]"
      aria-label="Carousel pagination"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="w-[52px] h-[52px] flex items-center justify-center rounded-full cursor-pointer hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-opacity"
      >
        <Icon name="chevron-left" size={24} className="invert" />
      </button>
      <span className="text-xl font-medium text-white tabular-nums">
        <span className="font-bold">{current}</span>
        <span className="text-[#999]">/{total}</span>
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="w-[52px] h-[52px] flex items-center justify-center rounded-full cursor-pointer hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-opacity"
      >
        <Icon name="chevron-right" size={24} className="invert" />
      </button>
    </div>
  );
}
