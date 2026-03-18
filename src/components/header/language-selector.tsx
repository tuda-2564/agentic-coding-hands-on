"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Language } from "@/types/auth";

type LanguageSelectorProps = {
  languages: Language[];
  isOpen?: boolean;
  onToggle?: () => void;
};

export default function LanguageSelector({
  languages,
  isOpen: controlledIsOpen,
  onToggle,
}: LanguageSelectorProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selected, setSelected] = useState<Language>(languages[0]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = useCallback(() => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
    // When opening, auto-focus the first option
    if (!isOpen) {
      setFocusedIndex(0);
    }
  }, [isControlled, onToggle, isOpen]);

  const handleClose = useCallback(() => {
    if (isControlled && onToggle && isOpen) {
      onToggle();
    } else if (!isControlled) {
      setInternalIsOpen(false);
    }
  }, [isControlled, onToggle, isOpen]);

  const handleListKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1 >= languages.length ? 0 : prev + 1;
            optionRefs.current[next]?.focus();
            return next;
          });
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1 < 0 ? languages.length - 1 : prev - 1;
            optionRefs.current[next]?.focus();
            return next;
          });
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < languages.length) {
            setSelected(languages[focusedIndex]);
            handleClose();
          }
          break;
        }
      }
    },
    [languages, focusedIndex, handleClose],
  );

  // Auto-focus the first option when dropdown opens
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select language, current: ${selected.label}`}
        className="w-[108px] h-14 p-4 rounded flex flex-row items-center justify-between cursor-pointer hover:bg-white/10 focus:outline-2 focus:outline-offset-2 focus:outline-white/50 transition-colors duration-150"
      >
        <Image
          src={selected.flag}
          alt={selected.code}
          width={24}
          height={24}
          className="shrink-0"
        />
        <span className="font-bold text-base leading-6 tracking-[0.15px] text-white">
          {selected.code}
        </span>
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Select language"
          aria-activedescendant={
            focusedIndex >= 0
              ? `lang-option-${languages[focusedIndex]?.code}`
              : undefined
          }
          onKeyDown={handleListKeyDown}
          className="absolute right-0 top-full mt-1 p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {languages.map((lang, index) => {
            const isSelected = lang.code === selected.code;
            return (
              <li
                key={lang.code}
                id={`lang-option-${lang.code}`}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => {
                  setSelected(lang);
                  handleClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(lang);
                    handleClose();
                  }
                }}
                className={`w-[108px] h-14 p-4 flex flex-row items-center gap-1 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 ${
                  isSelected
                    ? "bg-[rgba(255,234,158,0.2)] rounded-sm"
                    : "rounded hover:bg-white/10"
                }`}
              >
                <Image
                  src={lang.flag}
                  alt={lang.code}
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span className="font-bold text-base leading-6 tracking-[0.15px] text-center text-white">
                  {lang.code}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
