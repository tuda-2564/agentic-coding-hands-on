import SectionHeader from "@/components/kudos-board/section-header";
import SpotlightBoard from "@/components/kudos-board/spotlight-board";
import type { SpotlightEntry } from "@/types/kudos";

type SpotlightSectionProps = {
  total: number;
  entries: SpotlightEntry[];
};

export default function SpotlightSection({
  total,
  entries,
}: SpotlightSectionProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader title="SPOTLIGHT BOARD" />
      <div className="px-4 md:px-12 lg:px-[144px]">
        <SpotlightBoard total={total} entries={entries} />
      </div>
    </section>
  );
}
