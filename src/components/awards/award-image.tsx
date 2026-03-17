"use client";

import { useState } from "react";
import Image from "next/image";

type AwardImageProps = {
  src: string;
  alt: string;
  name: string;
  priority?: boolean;
};

export default function AwardImage({ src, alt, name, priority = false }: AwardImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full max-w-[336px] aspect-square rounded-3xl border border-[#FFEA9E] bg-navy flex items-center justify-center shrink-0 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]">
        <span className="text-[#FFEA9E] text-xl font-bold text-center px-4">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[336px] aspect-square rounded-3xl border border-[#FFEA9E] overflow-hidden shrink-0 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287] mix-blend-screen">
      <Image
        src={src}
        alt={alt}
        width={336}
        height={336}
        sizes="(max-width: 768px) 100vw, 336px"
        className="w-full h-full object-cover"
        priority={priority}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
