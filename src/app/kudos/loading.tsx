import SectionSkeleton from "@/components/ui/section-skeleton";

export default function KudosLoading() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[rgba(16,20,23,0.8)] backdrop-blur-sm z-50" />

      <div className="pt-20 flex flex-col gap-[120px] pb-[120px]">
        {/* Keyvisual skeleton */}
        <div className="w-full h-[300px] md:h-[400px] lg:h-[512px] bg-navy animate-pulse" />

        {/* Highlight carousel skeleton */}
        <section className="flex flex-col gap-10">
          <div className="px-4 md:px-12 lg:px-[144px]">
            <SectionSkeleton lines={2} />
          </div>
          <div className="flex gap-6 px-4 md:px-12 lg:px-[144px] overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-[528px] h-[320px] shrink-0 rounded-2xl bg-[#1a2a3a] animate-pulse"
              />
            ))}
          </div>
        </section>

        {/* All Kudos skeleton */}
        <section className="px-4 md:px-12 lg:px-[144px]">
          <SectionSkeleton lines={2} />
          <div className="flex gap-6 mt-10">
            <div className="flex flex-col gap-6 flex-1 lg:w-[680px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-3xl bg-[#1a2a3a] animate-pulse"
                />
              ))}
            </div>
            <div className="hidden lg:flex flex-col gap-6 w-[374px]">
              <div className="h-[320px] rounded-[17px] bg-[#1a2a3a] animate-pulse" />
              <div className="h-[400px] rounded-[17px] bg-[#1a2a3a] animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
