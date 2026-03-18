import type { KudoStats } from "@/types/kudos";
import OpenGiftButton from "@/components/kudos-board/open-gift-button";

export function StatsCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 p-6 bg-kudos-container-2 border border-kudos-border rounded-[17px] animate-pulse" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center justify-between h-10">
          <div className="h-4 rounded bg-kudos-divider" style={{ width: `${140 - i * 20}px` }} />
          <div className="h-4 w-8 rounded bg-kudos-divider" />
        </div>
      ))}
      <div className="h-px bg-kudos-divider" />
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center justify-between h-10">
          <div className="h-4 rounded bg-kudos-divider" style={{ width: `${160 - i * 20}px` }} />
          <div className="h-4 w-8 rounded bg-kudos-divider" />
        </div>
      ))}
      <div className="h-12 rounded-full bg-kudos-divider" />
    </div>
  );
}

type StatsCardProps = {
  stats: KudoStats;
};

const STAT_ROWS = [
  { key: "kudos_received", label: "Số Kudos bạn nhận được" },
  { key: "kudos_sent", label: "Số Kudos bạn đã gửi" },
  { key: "hearts_received", label: "Số tim bạn nhận được" },
] as const;

const SECRET_BOX_ROWS = [
  { key: "secret_boxes_opened", label: "Số Secret Box bạn đã mở" },
  { key: "secret_boxes_unopened", label: "Số Secret Box chưa mở" },
] as const;

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="flex flex-col gap-2.5 p-6 bg-kudos-container-2 border border-kudos-border rounded-[17px]">
      {STAT_ROWS.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between h-10"
          aria-label={`${row.label}: ${stats[row.key]}`}
        >
          <span className="text-base text-white">{row.label}</span>
          <span className="text-base font-bold text-kudos-gold">
            {stats[row.key]}
          </span>
        </div>
      ))}

      {/* Divider */}
      <div className="h-px bg-kudos-divider" />

      {SECRET_BOX_ROWS.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between h-10"
          aria-label={`${row.label}: ${stats[row.key]}`}
        >
          <span className="text-base text-white">{row.label}</span>
          <span className="text-base font-bold text-kudos-gold">
            {stats[row.key]}
          </span>
        </div>
      ))}

      <OpenGiftButton />
    </div>
  );
}
