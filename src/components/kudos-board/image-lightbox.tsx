"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Icon from "@/components/ui/icon";

type ImageLightboxProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export default function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  const goPrev = useCallback(() => {
    if (canPrev) setIndex((i) => i - 1);
  }, [canPrev]);

  const goNext = useCallback(() => {
    if (canNext) setIndex((i) => i + 1);
  }, [canNext]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white cursor-pointer hover:opacity-70"
          aria-label="Close lightbox"
        >
          <Icon name="close" size={24} className="invert" />
        </button>

        <Image
          src={images[index]}
          alt={`Image ${index + 1} of ${images.length}`}
          width={800}
          height={600}
          className="max-w-[90vw] max-h-[80vh] object-contain"
        />

        {canPrev && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 cursor-pointer hover:bg-black/80"
            aria-label="Previous image"
          >
            <Icon name="chevron-left" size={20} className="invert" />
          </button>
        )}

        {canNext && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 cursor-pointer hover:bg-black/80"
            aria-label="Next image"
          >
            <Icon name="chevron-right" size={20} className="invert" />
          </button>
        )}

        <p className="text-center text-white mt-2 text-sm">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
