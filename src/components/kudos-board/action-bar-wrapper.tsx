"use client";

import { useState } from "react";
import ActionBar from "@/components/kudos-board/action-bar";
import KudoModal from "@/components/kudo-modal/kudo-modal";

export default function ActionBarWrapper() {
  const [isKudoModalOpen, setIsKudoModalOpen] = useState(false);

  return (
    <>
      <ActionBar onOpenKudoModal={() => setIsKudoModalOpen(true)} />
      <KudoModal
        isOpen={isKudoModalOpen}
        onClose={() => setIsKudoModalOpen(false)}
        onSuccess={() => setIsKudoModalOpen(false)}
      />
    </>
  );
}
