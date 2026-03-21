"use client";

import { useState, useRef } from "react";
import KudosRulesPanel from "@/components/kudos/kudos-rules-panel";

export default function KudosRulesWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 border border-kudos-gold rounded-full text-kudos-gold font-bold text-sm tracking-[0.5px] transition-opacity duration-150 hover:opacity-80"
      >
        Xem thể lệ
      </button>
      <KudosRulesPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}
