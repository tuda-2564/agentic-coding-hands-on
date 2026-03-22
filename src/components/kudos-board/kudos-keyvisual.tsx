export default function KudosKeyvisual() {
  return (
    <section className="relative w-full h-[300px] md:h-[400px] lg:h-[512px] flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/images/keyvisual-awards.png)`,
        }}
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

      {/* Content — left-aligned per design, px:144px, vertically near bottom */}
      <div className="relative z-10 flex flex-col items-start gap-2.5 px-4 md:px-12 lg:px-36 pb-10 md:pb-14 lg:pb-16">
        <p className="text-xl md:text-2xl lg:text-4xl font-bold text-kudos-gold leading-snug">
          Hệ thống ghi nhận và cảm ơn
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-[139px] font-bold text-white leading-none tracking-tight"
          style={{ fontFamily: "var(--font-alt), sans-serif" }}
        >
          <span className="text-kudos-gold">✱</span> KUDOS
        </h1>
      </div>
    </section>
  );
}
