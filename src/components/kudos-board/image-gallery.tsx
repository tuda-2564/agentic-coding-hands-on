"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/icon";
import ImageLightbox from "@/components/kudos-board/image-lightbox";

type ImageGalleryProps = {
  imageUrls: string[];
  maxVisible?: number;
};

export default function ImageGallery({
  imageUrls,
  maxVisible = 5,
}: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (imageUrls.length === 0) return null;

  const visible = imageUrls.slice(0, maxVisible);
  const isVideo = (url: string) =>
    /\.(mp4|webm|mov)$/i.test(url);

  return (
    <>
      <div className="flex gap-2">
        {visible.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shrink-0"
          >
            <Image
              src={url}
              alt={`Attachment ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
            {isVideo(url) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Icon name="play" size={24} className="invert" />
              </div>
            )}
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={imageUrls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
