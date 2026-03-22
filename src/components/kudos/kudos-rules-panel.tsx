"use client";

import { useEffect, useRef, RefObject } from "react";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import HeroBadgeRow from "@/components/kudos/hero-badge-row";
import CollectibleIconGrid from "@/components/kudos/collectible-icon-grid";
import {
  HERO_BADGE_TIERS,
  COLLECTIBLE_ICONS,
  SECTION_1_HEADING,
  SECTION_1_BODY,
  SECTION_2_HEADING,
  SECTION_2_BODY,
  COLLECTION_NOTE,
  SECTION_3_HEADING,
  SECTION_3_BODY,
} from "@/utils/kudos-rules-data";

type KudosRulesPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export default function KudosRulesPanel({
  isOpen,
  onClose,
  triggerRef,
}: KudosRulesPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const titleEl = panelRef.current.querySelector<HTMLElement>(
      "#kudos-rules-title"
    );
    titleEl?.focus();

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const elements = Array.from(focusable);
    if (elements.length === 0) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus restoration on close (only when transitioning open→closed, not on initial mount)
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen
            ? "opacity-100 duration-200 ease-out"
            : "opacity-0 pointer-events-none duration-150 ease-in"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kudos-rules-title"
        aria-hidden={!isOpen}
        {...(!isOpen && { inert: true })}
        className={`fixed top-0 right-0 h-dvh z-50 w-full md:w-[480px] lg:w-[553px] bg-kudos-container-2 pt-4 px-5 pb-5 md:pt-6 md:px-10 md:pb-10 flex flex-col justify-between gap-10 transition-transform ${
          isOpen
            ? "translate-x-0 duration-200 ease-out"
            : "translate-x-full duration-150 ease-in"
        }`}
      >
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-6">
          {/* Title */}
          <h2
            id="kudos-rules-title"
            tabIndex={-1}
            className="text-kudos-gold font-bold text-[32px] leading-[40px] lg:text-[45px] lg:leading-[52px] outline-none"
          >
            Thể lệ
          </h2>

          {/* Sections Group */}
          <div className="flex flex-col gap-4">
            {/* Section 1 Container */}
            <div className="flex flex-col gap-4">
              <h3 className="text-kudos-gold font-bold text-[18px] leading-6 lg:text-[22px] lg:leading-7 uppercase">
                {SECTION_1_HEADING}
              </h3>
              <p className="text-white font-bold text-base leading-6 tracking-[0.5px] text-justify">
                {SECTION_1_BODY}
              </p>
              {HERO_BADGE_TIERS.map((tier) => (
                <HeroBadgeRow key={tier.id} tier={tier} />
              ))}
            </div>

            {/* Section 2 — flat siblings */}
            <h3 className="text-kudos-gold font-bold text-[18px] leading-6 lg:text-[22px] lg:leading-7 uppercase">
              {SECTION_2_HEADING}
            </h3>
            <p className="text-white font-bold text-base leading-6 tracking-[0.5px] text-justify">
              {SECTION_2_BODY}
            </p>
            <CollectibleIconGrid icons={COLLECTIBLE_ICONS} />
            <p className="text-white font-bold text-base leading-6 tracking-[0.5px] text-justify">
              {COLLECTION_NOTE}
            </p>

            {/* Section 3 — flat siblings */}
            <h3 className="text-kudos-gold font-bold text-2xl leading-8 uppercase">
              {SECTION_3_HEADING}
            </h3>
            <p className="text-white font-bold text-base leading-6 tracking-[0.5px] text-justify">
              {SECTION_3_BODY}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-14 flex items-center justify-center gap-2 bg-[rgba(255,234,158,0.10)] border border-kudos-border rounded p-4 text-white font-bold text-base tracking-[0.5px] transition-opacity duration-150 ease-in-out hover:opacity-80 active:opacity-60 focus-visible:outline-2 focus-visible:outline-kudos-border focus-visible:outline-offset-2"
          >
            <Icon name="close" size={24} />
            Đóng
          </button>
          <Link
            href="/kudos/write"
            className="flex-1 h-14 lg:w-[363px] lg:flex-none flex items-center justify-center gap-2 bg-kudos-gold rounded p-4 text-navy font-bold text-base tracking-[0.5px] transition-opacity duration-150 ease-in-out hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-kudos-gold focus-visible:outline-offset-2"
          >
            <Icon name="pencil" size={24} />
            Viết KUDOS
          </Link>
        </div>
      </div>
    </>
  );
}
