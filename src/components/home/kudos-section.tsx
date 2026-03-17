"use client";

import { useState, useRef } from "react";
import type { Kudo } from "@/types/kudos";
import KudosLiveBoard from "@/components/home/kudos-live-board";
import KudoModal from "@/components/kudo-modal/kudo-modal";
import Toast from "@/components/ui/toast";

type KudosSectionProps = {
  initialKudos: Kudo[];
};

export default function KudosSection({ initialKudos }: KudosSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSuccess = () => {
    setToastVisible(true);
  };

  return (
    <section aria-labelledby="kudos-heading" className="px-4 md:px-6 py-12">
      <div className="text-center mb-8 md:mb-12">
        <h2
          id="kudos-heading"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
        >
          Sun* Kudos
        </h2>
        <span className="inline-block mt-2 text-lg font-bold text-kudos-orange">
          #KUDOS
        </span>

        {/* Viết Kudo CTA */}
        <div className="mt-6">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-6 bg-transparent border border-gold rounded-lg text-sm font-semibold text-gold hover:bg-gold/10 focus:outline-2 focus:outline-gold transition-colors"
          >
            ✍ Viết Kudo
          </button>
        </div>
      </div>

      <KudosLiveBoard initialKudos={initialKudos} />

      {isModalOpen && (
        <KudoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          triggerRef={triggerRef}
        />
      )}

      {toastVisible && (
        <Toast
          message="Gửi kudo thành công! 🎉"
          type="success"
          onDismiss={() => setToastVisible(false)}
        />
      )}
    </section>
  );
}
