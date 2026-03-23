"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Icon from "@/components/ui/icon";
import type { Badge } from "@/types/kudos";

type BadgeSelectorProps = {
  selectedBadge: Badge | null;
  onSelect: (badge: Badge) => void;
  error?: string;
};

export default function BadgeSelector({
  selectedBadge,
  onSelect,
  error,
}: BadgeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [badgeList, setBadgeList] = useState<Badge[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calcDropdownPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, []);

  const fetchBadges = async () => {
    if (hasFetched) return;
    try {
      const res = await fetch("/api/badges");
      if (res.ok) {
        const data: Badge[] = await res.json();
        setBadgeList(data);
      }
    } catch {
      // Silently fail — user can retry by re-opening
    } finally {
      setHasFetched(true);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchBadges();
      calcDropdownPosition();
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (badge: Badge) => {
    onSelect(badge);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const dropdownEl = (
    <div
      ref={dropdownRef}
      id="badge-listbox"
      role="listbox"
      aria-label="Danh sách danh hiệu"
      style={dropdownStyle}
      className="bg-surface-dark border border-gold rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] max-h-50 overflow-y-auto"
    >
      {badgeList.length === 0 ? (
        <p className="px-3 py-3 text-sm text-[#6B8A9A] text-center">
          {hasFetched ? "Không có danh hiệu nào" : "Đang tải..."}
        </p>
      ) : (
        badgeList.map((badge) => {
          const isSelected = selectedBadge?.id === badge.id;
          return (
            <button
              key={badge.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(badge)}
              className={`w-full flex items-center gap-2.5 h-11 px-3 text-left text-[13px] font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? "bg-gold/15 text-gold"
                  : "text-white hover:bg-gold/10"
              }`}
            >
              {badge.icon_url ? (
                <Image
                  src={badge.icon_url}
                  alt={badge.name}
                  width={24}
                  height={24}
                  className="rounded border border-gold/40 shrink-0"
                />
              ) : (
                <span className="w-6 h-6 rounded border border-gold/40 bg-gold/10 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                  {badge.name.charAt(0)}
                </span>
              )}
              <span className="truncate">{badge.name}</span>
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-1">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-controls="badge-listbox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required="true"
        onClick={handleToggle}
        className={`w-full h-11 bg-surface-dark border rounded-lg flex items-center justify-between px-3 text-sm transition-all duration-150 ${
          error
            ? "border-[#EF4444]"
            : isOpen
            ? "border-gold shadow-[0_0_0_3px_rgba(200,169,110,0.2)]"
            : "border-[#1E3448] hover:border-gold/50 focus:border-gold focus:shadow-[0_0_0_3px_rgba(200,169,110,0.2)]"
        } outline-none`}
      >
        {selectedBadge ? (
          <span className="flex items-center gap-2.5">
            {selectedBadge.icon_url ? (
              <Image
                src={selectedBadge.icon_url}
                alt={selectedBadge.name}
                width={24}
                height={24}
                className="rounded border border-gold/40"
              />
            ) : (
              <span className="w-6 h-6 rounded border border-gold/40 bg-gold/10 flex items-center justify-center text-xs font-bold text-gold shrink-0">
                {selectedBadge.name.charAt(0)}
              </span>
            )}
            <span className="text-[13px] font-semibold text-white">
              {selectedBadge.name}
            </span>
          </span>
        ) : (
          <span className="text-[#6B8A9A] text-[14px]">Chọn danh hiệu...</span>
        )}
        <Icon
          name="chevron-down"
          size={16}
          className={`text-[#6B8A9A] transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown via portal — escapes overflow-y:auto clipping */}
      {mounted && isOpen && createPortal(dropdownEl, document.body)}

      {error && (
        <p role="alert" className="text-xs text-[#EF4444] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
