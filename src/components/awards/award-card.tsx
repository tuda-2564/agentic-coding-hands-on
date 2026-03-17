import type { AwardDetailCategory } from "@/types/awards";
import AwardImage from "@/components/awards/award-image";
import Icon from "@/components/ui/icon";

type AwardCardProps = {
  category: AwardDetailCategory;
  index: number;
};

export default function AwardCard({ category, index }: AwardCardProps) {
  const isImageLeft = index % 2 === 0;

  return (
    <article id={category.id} className="scroll-mt-16">
      <div
        className={`flex flex-col gap-8 lg:gap-10 ${
          isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        } lg:items-start`}
      >
        <AwardImage
          src={category.imageUrl}
          alt={`Giải thưởng ${category.name}`}
          name={category.name}
          priority={index < 2}
        />

        <div className="w-full lg:w-[480px] flex flex-col gap-8 rounded-2xl backdrop-blur-[32px] supports-[not(backdrop-filter:blur(32px))]:bg-navy/80">
          <div className="flex items-center gap-4">
            <Icon name="target" size={24} className="shrink-0" />
            <h3 className="text-[#FFEA9E] font-bold text-xl lg:text-2xl leading-8">
              {category.name}
            </h3>
          </div>

          <p className="text-white font-bold text-sm lg:text-base leading-6 tracking-[0.5px] text-justify">
            {category.description}
          </p>

          <div className="h-px bg-[#2E3940]" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Icon name="diamond" size={24} className="shrink-0" />
              <span className="text-[#FFEA9E] font-bold text-lg lg:text-2xl leading-8">
                Số lượng giải thưởng:
              </span>
            </div>
            <div className="flex items-baseline gap-3 pl-10">
              <span className="text-white font-bold text-2xl lg:text-4xl leading-[44px]">
                {String(category.quantity).padStart(2, "0")}
              </span>
              <span className="text-white font-bold text-sm leading-5">
                {category.unitType}
              </span>
            </div>
          </div>

          <div className="h-px bg-[#2E3940]" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Icon name="license" size={24} className="shrink-0" />
              <span className="text-[#FFEA9E] font-bold text-lg lg:text-2xl leading-8">
                Giá trị giải thưởng:
              </span>
            </div>
            {category.prizeTiers.map((tier, tierIndex) => (
              <div key={tierIndex} className="flex flex-col pl-10">
                <span className="text-white font-bold text-2xl lg:text-4xl leading-[44px]">
                  {tier.value}
                </span>
                {tier.label && (
                  <span className="text-white font-bold text-sm leading-5">
                    {tier.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
