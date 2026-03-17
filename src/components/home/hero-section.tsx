import type { Campaign } from "@/types/campaign";
import CountdownTimer from "@/components/home/countdown-timer";

type HeroSectionProps = {
  campaign: Campaign | null;
};

export default function HeroSection({ campaign }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-16 gap-6 min-h-[60vh]">
      {campaign ? (
        <>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold uppercase tracking-[0.02em] bg-linear-to-b from-gold-gradient-start to-gold-gradient-end bg-clip-text text-transparent leading-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            {campaign.theme || "ROOT FURTHER"}
          </h1>
          <p className="text-base md:text-lg text-[#B0BEC5] max-w-150">
            {campaign.name}
          </p>
          <CountdownTimer targetDate={campaign.event_date} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold uppercase bg-linear-to-b from-gold-gradient-start to-gold-gradient-end bg-clip-text text-transparent leading-tight">
            SAA 2025
          </h1>
          <p className="text-lg text-white/60">
            Coming soon — stay tuned for SAA 2025!
          </p>
        </div>
      )}
    </section>
  );
}
