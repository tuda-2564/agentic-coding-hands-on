"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import localFont from "next/font/local";
import { useCountdown } from "@/hooks/use-countdown";
import CountdownUnit from "@/components/countdown/countdown-unit";

const digitalNumbers = localFont({
  src: "../../fonts/digital-numbers.ttf",
  variable: "--font-digital",
  display: "swap",
  fallback: ["monospace"],
});

type PrelaunchCountdownProps = {
  eventDate: string;
};

export default function PrelaunchCountdown({
  eventDate,
}: PrelaunchCountdownProps) {
  const router = useRouter();
  const { days, hours, minutes, isExpired } = useCountdown(eventDate);

  useEffect(() => {
    if (isExpired) {
      router.refresh();
    }
  }, [isExpired, router]);

  const timeDescription = `${days} ngày, ${hours} giờ, ${minutes} phút`;

  return (
    <div
      className={`relative w-full min-h-screen bg-[#00101A] overflow-hidden animate-fade-in ${digitalNumbers.variable}`}
    >
      {/* Background Image */}
      <Image
        src="/images/prelaunch-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover z-0"
        aria-hidden="true"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <main
        className="relative z-[2] flex flex-col items-center justify-center min-h-screen px-6 py-12 md:px-12 md:py-16 lg:px-[144px] lg:py-[96px]"
        role="timer"
        aria-live="polite"
        aria-label={`Sự kiện sẽ bắt đầu sau ${timeDescription}`}
      >
        <div className="flex flex-col items-center gap-6">
          <h1 className="font-bold text-xl leading-7 md:text-[28px] lg:text-4xl lg:leading-[48px] text-white text-center">
            Sự kiện sẽ bắt đầu sau
          </h1>

          <div className="flex flex-row items-center gap-4 md:gap-8 lg:gap-[60px]">
            <CountdownUnit value={days} label="DAYS" />
            <CountdownUnit value={hours} label="HOURS" />
            <CountdownUnit value={minutes} label="MINUTES" />
          </div>
        </div>
      </main>
    </div>
  );
}
