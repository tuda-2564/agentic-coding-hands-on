"use client";

import Image from "next/image";
import type { AwardCategory } from "@/types/awards";
import { formatVND } from "@/utils/format";

type AwardCardProps = {
  category: AwardCategory;
};

export default function AwardCard({ category }: AwardCardProps) {
  return (
    <article
      aria-label={`Award: ${category.name}`}
      className="group relative bg-surface-card border border-gold/30 rounded-xl p-4 flex flex-col items-center text-center gap-4 motion-safe:transition-all motion-safe:duration-200 hover:border-gold/60 hover:shadow-[0_0_20px_rgba(200,169,110,0.15)] motion-safe:hover:-translate-y-0.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold"
    >
      <div className="relative w-20 h-20">
        <Image
          src={category.badge_image_url}
          alt={`${category.name} badge`}
          fill
          sizes="80px"
          className="object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = "/images/awards/mvp.svg";
          }}
        />
      </div>
      <h3 className="text-lg font-bold text-gold leading-6">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-sm text-[#B0BEC5] leading-5 line-clamp-2">
          {category.description}
        </p>
      )}
      <p className="text-base font-bold text-white">
        {formatVND(category.prize_value)}
      </p>
    </article>
  );
}
