"use client";

import { useKudosStream } from "@/hooks/use-kudos-stream";
import type { Kudo } from "@/types/kudos";

type KudosLiveBoardProps = {
  initialKudos: Kudo[];
};

export default function KudosLiveBoard({ initialKudos }: KudosLiveBoardProps) {
  const { kudos, isConnected, error } = useKudosStream(initialKudos);

  if (kudos.length === 0) {
    return (
      <div className="text-center py-8 text-white/60 text-sm">
        No kudos yet — be the first!
      </div>
    );
  }

  return (
    <div className="max-w-200 mx-auto">
      {!isConnected && kudos.length > 0 && (
        <div className="mb-4 text-center text-xs text-white/40">
          {error
            ? "Live board unavailable — showing cached data"
            : "Reconnecting..."}
        </div>
      )}
      <div
        aria-live="polite"
        className="space-y-4 max-h-100 overflow-y-auto"
      >
        {kudos.map((kudo) => (
          <div
            key={kudo.id}
            className="bg-surface-card border border-gold/20 rounded-lg p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm shrink-0">
              {kudo.sender_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-bold">
                  {kudo.sender_name || "Someone"}
                </span>
                {" → "}
                <span className="font-bold">
                  {kudo.receiver_name || "Someone"}
                </span>
              </p>
              <p className="text-sm text-[#B0BEC5] mt-1">{kudo.message}</p>
              <time className="text-xs text-white/40 mt-1 block">
                {new Date(kudo.created_at).toLocaleString("vi-VN")}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
