"use client";

import { useCountdown } from "@/hooks/use-countdown";

type CountdownTimerProps = {
  targetDate: string;
};

const LABELS = ["Ngày", "Giờ", "Phút", "Giây"];

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } =
    useCountdown(targetDate);

  if (isExpired) {
    return (
      <div
        role="timer"
        aria-live="polite"
        className="text-center text-gold text-xl font-bold"
      >
        Event Started
      </div>
    );
  }

  const values = [days, hours, minutes, seconds];

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây còn lại`}
      className="flex items-center justify-center gap-4"
    >
      {values.map((value, i) => (
        <div
          key={LABELS[i]}
          className="flex flex-col items-center gap-1 w-14 h-14 md:w-20 md:h-20 rounded-lg bg-countdown-bg border border-gold/30 justify-center motion-safe:transition-all"
        >
          <span className="text-[32px] font-bold text-white leading-10 tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-xs text-[#B0BEC5] uppercase tracking-[0.05em]">
            {LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
