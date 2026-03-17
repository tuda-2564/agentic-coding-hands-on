import type { AwardCategory } from "@/types/awards";
import AwardCard from "@/components/home/award-card";
import ErrorRetry from "@/components/home/error-retry";

type AwardsGridProps = {
  categories: AwardCategory[];
  error?: boolean;
};

export default function AwardsGrid({ categories, error }: AwardsGridProps) {
  return (
    <section aria-labelledby="awards-heading" className="px-6 py-12">
      <h2
        id="awards-heading"
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-gold text-center mb-8 md:mb-12"
      >
        Hệ thống giải thưởng
      </h2>

      {error ? (
        <ErrorRetry message="Unable to load awards. Please try again." />
      ) : categories.length === 0 ? (
        <p className="text-center text-white/60 text-sm">
          No awards configured yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-300 mx-auto">
          {categories.map((category) => (
            <AwardCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
