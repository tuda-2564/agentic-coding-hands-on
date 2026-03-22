import type { AwardDetailCategory } from "@/types/awards";
import AwardImage from "@/components/awards/award-image";
import Icon from "@/components/ui/icon";

type AwardCardProps = {
  category: AwardDetailCategory;
  index: number;
};

export default function AwardCard({ category, index }: AwardCardProps) {
  const isImageLeft = index % 2 === 0;
  const paragraphs = category.description.split("\n\n");

  return (
    <article id={category.id} className="scroll-mt-20">
      <div
        className={`flex flex-col gap-10 ${
          isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        } lg:items-start`}
      >
        <AwardImage
          src={category.imageUrl}
          alt={`Giải thưởng ${category.name}`}
          name={category.name}
          priority={index < 2}
        />

        <div className="w-full lg:w-120 flex flex-col gap-8 rounded-2xl backdrop-blur-[32px]">
          <div className="flex items-center gap-4">
            <Icon name="target" size={24} className="shrink-0" />
            <h3 className="text-kudos-gold font-bold text-xl lg:text-2xl leading-8">
              {category.name}
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-white font-bold text-sm lg:text-base leading-6 tracking-[0.5px] text-justify"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="h-px bg-kudos-divider" />

          {/* Quantity row — all on ONE horizontal line: icon | label | number | unit */}
          <div className="flex items-center gap-4">
            <Icon name="diamond" size={24} className="shrink-0" />
            <span className="text-kudos-gold font-bold text-lg lg:text-2xl leading-8">
              Số lượng giải thưởng:
            </span>
            <span className="text-white font-bold text-2xl lg:text-4xl leading-11">
              {String(category.quantity).padStart(2, "0")}
            </span>
            <span className="text-white font-bold text-sm leading-5">
              {category.unitType}
            </span>
          </div>

          <div className="h-px bg-kudos-divider" />

          {/* Prize value section — vertical stack, no indent on value/subtitle */}
          <div className="flex flex-col gap-2">
            {category.prizeTiers.map((tier, tierIndex) => (
              <div key={tierIndex}>
                {tierIndex > 0 && (
                  <div className="flex items-center gap-2 my-2">
                    <span className="text-kudos-border font-bold text-sm leading-5">
                      Hoặc
                    </span>
                    <div className="flex-1 h-px bg-kudos-divider" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <Icon name="license" size={24} className="shrink-0" />
                    <span className="text-kudos-gold font-bold text-lg lg:text-2xl leading-8">
                      Giá trị giải thưởng:
                    </span>
                  </div>
                  <span className="text-white font-bold text-2xl lg:text-4xl leading-11">
                    {tier.value}
                  </span>
                  {tier.label && (
                    <span className="text-white font-bold text-sm leading-5">
                      {tier.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
