import type { ReactNode } from "react";
import SectionHeader from "@/components/kudos-board/section-header";
import KudoFeed from "@/components/kudos-board/kudo-feed";
import type { KudoHighlight } from "@/types/kudos";

type AllKudosSectionProps = {
  initialKudos: KudoHighlight[];
  initialCursor: string | null;
  sidebar?: ReactNode;
};

export default function AllKudosSection({
  initialKudos,
  initialCursor,
  sidebar,
}: AllKudosSectionProps) {
  return (
    <section className="flex flex-col gap-10">
      <SectionHeader title="ALL KUDOS" />
      <div className="px-4 md:px-12 lg:px-[144px]">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Kudo feed — left column */}
          <div className="w-full lg:w-[680px]">
            <KudoFeed
              initialKudos={initialKudos}
              initialCursor={initialCursor}
            />
          </div>
          {/* Sidebar — right column */}
          {sidebar && (
            <aside className="w-full lg:w-[374px] flex flex-col gap-6 shrink-0">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
