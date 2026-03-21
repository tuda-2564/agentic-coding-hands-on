export default function SectionTitle() {
  return (
    <div className="flex flex-col gap-4 items-start">
      <p className="text-white font-bold text-lg lg:text-2xl leading-8">
        Sun* Annual Awards 2025
      </p>
      {/* Rectangle 26 — 1px horizontal divider between subtitle and title (Figma node 313:8455) */}
      <div className="w-full h-px bg-kudos-divider" />
      <h1 className="text-kudos-gold font-bold text-3xl md:text-4xl lg:text-[57px] lg:leading-tight">
        Hệ thống giải thưởng SAA 2025
      </h1>
    </div>
  );
}
