export default function KudosKeyvisual() {
  return (
    <section className="relative w-full h-[300px] md:h-[400px] lg:h-[512px] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/80 to-navy" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-kudos-gold">
          Hệ thống ghi nhận và cảm ơn
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-[139px] font-bold text-white leading-none tracking-tight"
          style={{ fontFamily: "var(--font-alt), sans-serif" }}
        >
          KUDOS
        </h1>
      </div>
    </section>
  );
}
