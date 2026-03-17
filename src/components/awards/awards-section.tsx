import type { AwardDetailCategory } from "@/types/awards";
import AwardSidebar from "@/components/awards/award-sidebar";
import AwardCard from "@/components/awards/award-card";

type AwardsSectionProps = {
  categories: AwardDetailCategory[];
};

export default function AwardsSection({ categories }: AwardsSectionProps) {
  const sidebarCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <section className="px-4 md:px-12 lg:px-36">
      <div className="flex flex-row gap-10">
        <AwardSidebar categories={sidebarCategories} />

        <div className="flex-1 flex flex-col">
          {categories.map((category, index) => (
            <div key={category.id}>
              <AwardCard category={category} index={index} />
              {index < categories.length - 1 && (
                <div className="h-px bg-[#2E3940] my-8 lg:my-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
