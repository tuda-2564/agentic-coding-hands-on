"use client";

import Icon from "@/components/ui/icon";

export default function OpenGiftButton() {
  const handleClick = () => {
    // TODO: Open Secret Box dialog (frame 1466:7676 — separate feature spec)
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-2 w-full h-[60px] px-4 bg-kudos-gold rounded-lg text-base font-bold text-[#00101A] cursor-pointer hover:bg-kudos-cream transition-colors"
    >
      <Icon name="gift" size={20} />
      Mở Secret Box
    </button>
  );
}
