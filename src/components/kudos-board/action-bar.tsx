"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Icon from "@/components/ui/icon";
import type { Colleague } from "@/types/kudos";

type ActionBarProps = {
  onOpenKudoModal: () => void;
};

export default function ActionBar({ onOpenKudoModal }: ActionBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Colleague[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/users/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = (await res.json()) as Colleague[];
        setSearchResults(data);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      }
    }, 300);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 lg:gap-[33px] px-4 md:px-12 lg:px-36">
      {/* Recognition input */}
      <button
        type="button"
        onClick={onOpenKudoModal}
        className="flex items-center gap-2 flex-1 lg:w-[738px] h-[72px] px-4 bg-[rgba(255,234,158,0.1)] border border-kudos-border rounded-[68px] cursor-pointer hover:bg-[rgba(255,234,158,0.4)] transition-colors"
      >
        <Icon name="pen" size={20} className="opacity-40 shrink-0" />
        <span className="text-base text-[#999]">
          Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
        </span>
      </button>

      {/* Search sunner input */}
      <div ref={dropdownRef} className="relative lg:w-[381px]">
        <div className="flex items-center gap-2 h-[72px] px-4 bg-[rgba(255,234,158,0.1)] border border-kudos-border rounded-[68px] focus-within:border-kudos-gold transition-colors">
          <Icon name="search" size={20} className="opacity-40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true);
            }}
            placeholder="Tìm kiếm sunner"
            className="flex-1 bg-transparent text-base text-white placeholder:text-[#999] outline-none"
          />
        </div>

        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#001520] border border-kudos-border rounded-lg max-h-60 overflow-y-auto z-20">
            {searchResults.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setShowResults(false);
                  setSearchQuery("");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(255,234,158,0.1)] cursor-pointer transition-colors"
              >
                <Image
                  src={user.avatar_url ?? "/icons/hamburger.svg"}
                  alt={user.full_name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="text-sm font-medium text-white truncate">
                  {user.full_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
