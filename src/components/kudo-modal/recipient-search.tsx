"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Icon from "@/components/ui/icon";
import type { Colleague } from "@/types/kudos";

type RecipientSearchProps = {
  recipients: Colleague[];
  onAdd: (colleague: Colleague) => void;
  onRemove: (id: string) => void;
  error?: string;
};

export default function RecipientSearch({
  recipients,
  onAdd,
  onRemove,
  error,
}: RecipientSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Colleague[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calcDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, []);

  const fetchUsers = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        setIsDropdownOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data: Colleague[] = await res.json();
        setResults(data);
        calcDropdownPosition();
        setIsDropdownOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [calcDropdownPosition]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(value), 300);
  };

  const handleSelect = (colleague: Colleague) => {
    const alreadyAdded = recipients.some((r) => r.id === colleague.id);
    if (!alreadyAdded) {
      onAdd(colleague);
    }
    setQuery("");
    setResults([]);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const filteredResults = results.filter(
    (r) => !recipients.some((selected) => selected.id === r.id)
  );

  const dropdownEl = (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-label="Kết quả tìm kiếm"
      style={dropdownStyle}
      className="bg-surface-dark border border-gold rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] max-h-50 overflow-y-auto"
    >
      {filteredResults.length === 0 ? (
        <p className="px-3 py-3 text-sm text-[#6B8A9A] text-center">
          Không tìm thấy kết quả
        </p>
      ) : (
        filteredResults.map((colleague) => (
          <button
            key={colleague.id}
            type="button"
            role="option"
            aria-selected={false}
            onClick={() => handleSelect(colleague)}
            className="w-full flex items-center gap-2.5 h-11 px-3 text-left text-sm text-white hover:bg-gold/10 transition-colors"
          >
            {colleague.avatar_url ? (
              <Image
                src={colleague.avatar_url}
                alt={colleague.full_name}
                width={28}
                height={28}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="w-7 h-7 rounded-full bg-[#1E3448] flex items-center justify-center text-xs text-gold shrink-0">
                {colleague.full_name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate">{colleague.full_name}</span>
          </button>
        ))
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Selected recipient chips */}
      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {recipients.map((r) => (
            <span
              key={r.id}
              className="flex items-center gap-1.5 h-7 px-2.5 bg-[#0F2A3D] border border-gold/30 rounded-full text-[13px] font-medium text-gold"
            >
              {r.avatar_url && (
                <Image
                  src={r.avatar_url}
                  alt={r.full_name}
                  width={18}
                  height={18}
                  className="rounded-full object-cover"
                />
              )}
              {r.full_name}
              <button
                type="button"
                onClick={() => onRemove(r.id)}
                className="ml-0.5 text-[#B0BEC5] hover:text-white transition-colors leading-none"
                aria-label={`Xóa ${r.full_name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div ref={containerRef} className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="search" size={16} className="text-[#6B8A9A]" />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.length >= 2 && results.length > 0) {
              calcDropdownPosition();
              setIsDropdownOpen(true);
            }
          }}
          placeholder="Tìm kiếm..."
          aria-label="Tìm kiếm người nhận"
          aria-autocomplete="list"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-required="true"
          className={`w-full h-11 bg-surface-dark border rounded-lg pl-9 pr-3 text-sm text-white placeholder:text-[#6B8A9A] outline-none transition-all duration-150 ${
            error
              ? "border-[#EF4444]"
              : "border-[#1E3448] focus:border-gold focus:shadow-[0_0_0_3px_rgba(200,169,110,0.2)]"
          }`}
        />
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B8A9A] text-xs">
            ...
          </span>
        )}
      </div>

      {/* Dropdown via portal — escapes overflow-y:auto clipping */}
      {mounted && isDropdownOpen && createPortal(dropdownEl, document.body)}

      {error && (
        <p role="alert" className="text-xs text-[#EF4444] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
