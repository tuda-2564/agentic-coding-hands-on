"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type FilterButtonProps = {
  label: string;
  options: string[];
  value?: string;
  onSelect: (value: string | undefined) => void;
  loading?: boolean;
  onOpen?: () => void;
};

export default function FilterButton({
  label,
  options,
  value,
  onSelect,
  loading,
  onOpen,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) onOpen?.();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-4 py-4 rounded border text-base font-medium text-white cursor-pointer transition-all duration-150 ${
          isOpen || value
            ? "border-kudos-gold bg-[rgba(255,234,158,0.1)]"
            : "border-kudos-border bg-[rgba(255,234,158,0.1)] hover:bg-[rgba(255,234,158,0.4)]"
        }`}
      >
        <span>{value ?? label}</span>
        <Icon name="chevron-down" size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 mt-1 min-w-[200px] max-h-60 overflow-y-auto bg-[#001520] border border-kudos-border rounded z-20"
        >
          {loading ? (
            <div className="p-3 text-sm text-[#999]">Loading...</div>
          ) : (
            <>
              {value && (
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    onSelect(undefined);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#999] hover:bg-[rgba(255,234,158,0.1)] cursor-pointer"
                >
                  Clear filter
                </button>
              )}
              {options.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  role="option"
                  aria-selected={value === opt}
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-[rgba(255,234,158,0.1)] ${
                    value === opt
                      ? "text-kudos-gold font-bold"
                      : "text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
              {options.length === 0 && !loading && (
                <div className="p-3 text-sm text-[#999]">No options</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
