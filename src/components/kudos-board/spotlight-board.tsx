"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import type { SpotlightEntry } from "@/types/kudos";

type SpotlightBoardProps = {
  total: number;
  entries: SpotlightEntry[];
};

// Generate deterministic positions for names
function generatePositions(count: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    // Spread names across the canvas using a simple hash-based layout
    const angle = (i * 137.508) * (Math.PI / 180); // Golden angle
    const radius = Math.sqrt(i / count) * 45; // Normalized radius (0-45%)
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    positions.push({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(10, Math.min(90, y)),
    });
  }
  return positions;
}

function getFontSize(count: number, maxCount: number): number {
  const min = 7;
  const max = 16;
  if (maxCount <= 0) return min;
  return min + ((count / maxCount) * (max - min));
}

export default function SpotlightBoard({
  total,
  entries,
}: SpotlightBoardProps) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"pan" | "zoom">("pan");
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const maxCount = useMemo(
    () => Math.max(...entries.map((e) => e.kudos_count), 1),
    [entries]
  );

  const positions = useMemo(
    () => generatePositions(entries.length),
    [entries.length]
  );

  const searchLower = search.toLowerCase();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (mode !== "pan") return;
      dragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [mode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current || mode !== "pan") return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    },
    [mode]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleClick = useCallback(
    () => {
      if (mode !== "zoom") return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nextScale = scale < 3 ? scale + 0.5 : 1;
      setScale(nextScale);
      if (nextScale === 1) setTranslate({ x: 0, y: 0 });
    },
    [mode, scale]
  );

  return (
    <div className="relative w-full h-[400px] md:h-[548px] border border-kudos-border overflow-hidden bg-black/70">
      {/* Header controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <span className="text-2xl md:text-4xl font-bold text-white">
          {total.toLocaleString()} KUDOS
        </span>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(255,234,158,0.1)] border border-kudos-border rounded-full w-[180px] md:w-[219px]">
            <Icon name="search" size={16} className="opacity-40 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#999] outline-none"
            />
          </div>
          {/* Pan/Zoom toggle */}
          <button
            type="button"
            onClick={() => setMode((m) => (m === "pan" ? "zoom" : "pan"))}
            className="w-6 h-6 flex items-center justify-center cursor-pointer hover:opacity-80"
            aria-label={mode === "pan" ? "Switch to zoom" : "Switch to pan"}
          >
            <Icon
              name="pan-zoom"
              size={24}
              className="invert"
            />
          </button>
        </div>
      </div>

      {/* Word cloud canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 select-none"
        style={{
          cursor: mode === "pan" ? "grab" : "zoom-in",
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          willChange: "transform",
          transition: dragging.current ? "none" : "transform 200ms ease-out",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        {entries.map((entry, i) => {
          const pos = positions[i];
          const fontSize = getFontSize(entry.kudos_count, maxCount);
          const isMatch =
            searchLower && entry.full_name.toLowerCase().includes(searchLower);
          const isFiltered = searchLower && !isMatch;

          return (
            <span
              key={entry.user_id}
              className="absolute font-bold text-white transition-opacity duration-200"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                fontSize: `${fontSize}px`,
                lineHeight: "1",
                opacity: isFiltered ? 0.15 : 1,
                color: isMatch ? "#F17676" : "#FFFFFF",
                transform: "translate(-50%, -50%)",
              }}
              title={`${entry.full_name}: ${entry.kudos_count} kudos`}
            >
              {entry.full_name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
