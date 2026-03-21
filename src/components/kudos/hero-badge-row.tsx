"use client";

import { useState } from "react";
import Image from "next/image";
import type { HeroBadgeTier } from "@/types/kudos-rules";

type HeroBadgeRowProps = {
  tier: HeroBadgeTier;
};

export default function HeroBadgeRow({ tier }: HeroBadgeRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Tier 1: Badge pill + Condition text */}
      <div className="flex flex-row items-center gap-2">
        {imgError ? (
          <span className="w-[126px] h-[22px] shrink-0 rounded-full border border-kudos-gold text-center text-[13px] font-bold text-white leading-[22px] [text-shadow:0_0.4px_1.8px_#000]">
            {tier.label}
          </span>
        ) : (
          <Image
            src={tier.imageSrc}
            alt={tier.label}
            width={126}
            height={22}
            className="w-[126px] h-[22px] shrink-0 rounded-full border border-kudos-gold object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <span className="text-white font-bold text-base leading-6 tracking-[0.5px]">
          {tier.condition}
        </span>
      </div>

      {/* Tier 2: Description text */}
      <p className="text-white font-bold text-sm leading-5 tracking-[0.1px] text-justify">
        {tier.description}
      </p>
    </div>
  );
}
