"use client";

import { useEffect, useState } from "react";
import { calculateTimeLeft, type TimeLeft } from "@/utils/countdown";

type CountdownResult = TimeLeft & {
  isExpired: boolean;
};

export function useCountdown(targetDate: string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(new Date(targetDate))
  );

  useEffect(() => {
    const target = new Date(targetDate);

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return { ...timeLeft, isExpired };
}
