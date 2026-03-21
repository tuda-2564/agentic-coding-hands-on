"use client";

import { useState } from "react";
import Image from "next/image";
import type { CollectibleIcon } from "@/types/kudos-rules";

type CollectibleIconGridProps = {
  icons: CollectibleIcon[];
};

function IconCell({ icon }: { icon: CollectibleIcon }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-20 flex flex-col items-center justify-center gap-2">
      {imgError ? (
        <div className="w-16 h-16 rounded-full border-2 border-white bg-navy" />
      ) : (
        <Image
          src={icon.imageSrc}
          alt={icon.alt}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full border-2 border-white overflow-hidden object-cover"
          onError={() => setImgError(true)}
        />
      )}
      <span className="w-20 text-[11px] font-bold leading-4 tracking-[0.5px] text-white text-center">
        {icon.label}
      </span>
    </div>
  );
}

export default function CollectibleIconGrid({
  icons,
}: CollectibleIconGridProps) {
  const row1 = icons.slice(0, 3);
  const row2 = icons.slice(3, 6);

  return (
    <div className="flex flex-col px-6">
      <div className="flex flex-col gap-4 px-6">
        <div className="flex flex-row justify-between">
          {row1.map((icon) => (
            <IconCell key={icon.id} icon={icon} />
          ))}
        </div>
        <div className="flex flex-row justify-between">
          {row2.map((icon) => (
            <IconCell key={icon.id} icon={icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
