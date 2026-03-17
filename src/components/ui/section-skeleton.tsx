type SectionSkeletonProps = {
  lines?: number;
  className?: string;
};

export default function SectionSkeleton({
  lines = 3,
  className = "",
}: SectionSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-gradient-to-r from-[#0A1E2B] via-[#132D3F] to-[#0A1E2B] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
