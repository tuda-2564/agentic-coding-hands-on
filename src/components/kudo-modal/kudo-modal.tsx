"use client";

import { useEffect, useRef, RefObject } from "react";
import Icon from "@/components/ui/icon";
import RecipientSearch from "@/components/kudo-modal/recipient-search";
import BadgeSelector from "@/components/kudo-modal/badge-selector";
import RichTextEditor from "@/components/kudo-modal/rich-text-editor";
import HashtagInput from "@/components/kudo-modal/hashtag-input";
import ImageUpload from "@/components/kudo-modal/image-upload";
import { useKudoForm } from "@/hooks/use-kudo-form";

type KudoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export default function KudoModal({
  isOpen,
  onClose,
  onSuccess,
  triggerRef,
}: KudoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const {
    recipients,
    selectedBadge,
    content,
    hashtags,
    images,
    isSubmitting,
    submitError,
    fieldErrors,
    addRecipient,
    removeRecipient,
    setBadge,
    setContent,
    addHashtag,
    removeHashtag,
    addImages,
    removeImage,
    submit,
    reset,
  } = useKudoForm({ onSuccess: handleSuccess });

  const handleClose = () => {
    reset();
    onClose();
    triggerRef?.current?.focus();
  };

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, input, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );
    const elements = Array.from(focusable);
    if (elements.length === 0) return;

    // Focus first element on open
    elements[0].focus();

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

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: "rgba(0,13,20,0.7)" }}
      onClick={handleClose}
      aria-hidden="false"
    >
      {/* Modal container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kudo-modal-title"
        className="
          w-full max-h-[100dvh]
          md:w-[min(560px,90vw)] md:max-h-[90vh]
          lg:w-[600px]
          bg-surface-card
          border border-gold/30
          rounded-t-[16px] md:rounded-xl
          shadow-[0_24px_64px_rgba(0,0,0,0.7)]
          flex flex-col
          overflow-hidden
          transition-all duration-200
        "
        onClick={(e) => e.stopPropagation()}
        data-state={isOpen ? "open" : "closed"}
      >
        {/* ── Header ── */}
        <header className="flex items-center justify-between px-5 md:px-8 pt-6 pb-4 border-b border-gold/20 flex-shrink-0">
          <h2
            id="kudo-modal-title"
            className="text-white font-bold text-base md:text-xl leading-7"
          >
            Gửi lời cảm ơn và ghi nhận đến đồng đội
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#B0BEC5] hover:text-white hover:bg-white/10 focus:outline-2 focus:outline-[#C8A96E] transition-colors flex-shrink-0"
            aria-label="Đóng modal"
          >
            <Icon name="close" size={16} />
          </button>
        </header>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-4 flex flex-col gap-4">

          {/* Người nhận */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label className="text-sm font-semibold text-white">
              Người nhận <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <RecipientSearch
                recipients={recipients}
                onAdd={addRecipient}
                onRemove={removeRecipient}
                error={fieldErrors.recipients}
              />
            </div>
          </fieldset>

          {/* Danh hiệu */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label className="text-sm font-semibold text-white">
              Danh hiệu <span className="text-[#EF4444]">*</span>
            </label>
            <p className="text-xs text-[#6B8A9A] mt-1">
              Đánh chọn người nhận hiệu phù hợp
            </p>
            <BadgeSelector
              selectedBadge={selectedBadge}
              onSelect={setBadge}
              error={fieldErrors.badge}
            />
          </fieldset>

          {/* Nội dung */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label className="text-sm font-semibold text-white">
              Nội dung <span className="text-[#EF4444]">*</span>
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              error={fieldErrors.content}
            />
          </fieldset>

          {/* Hashtag */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label className="text-sm font-semibold text-white">Hashtag</label>
            <HashtagInput
              hashtags={hashtags}
              onAdd={addHashtag}
              onRemove={removeHashtag}
            />
          </fieldset>

          {/* Image */}
          <fieldset className="flex flex-col gap-1 border-none p-0 m-0">
            <label className="text-sm font-semibold text-white">Hình ảnh</label>
            <ImageUpload
              images={images}
              onAdd={addImages}
              onRemove={removeImage}
            />
          </fieldset>
        </div>

        {/* ── Footer ── */}
        <footer className="flex flex-col gap-1 px-5 md:px-8 pt-4 pb-6 border-t border-gold/20 flex-shrink-0">
          <p className="text-xs text-[#6B8A9A] text-center pb-2">
            Gửi lời cảm ơn và ghi nhận đến đồng đội của bạn
          </p>

          {submitError && (
            <p role="alert" className="text-xs text-[#EF4444] text-center pb-1">
              {submitError}
            </p>
          )}

          <div className="flex flex-col-reverse md:flex-row md:justify-end gap-2">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-10 px-5 bg-[#1A2D3E] border border-[#2D4A63] rounded-lg text-sm font-semibold text-[#B0BEC5] hover:bg-[#1E3448] hover:text-white hover:border-[#3A5C78] focus:outline-2 focus:outline-[#C8A96E] active:bg-[#152436] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>

            {/* Send */}
            <button
              type="button"
              onClick={submit}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-disabled={isSubmitting}
              className="h-10 px-6 bg-kudos-orange border-none rounded-lg text-sm font-semibold text-white hover:bg-[#E55A28] hover:-translate-y-px active:bg-[#CC4F22] focus:outline-2 focus:outline-[#FF6B35] focus:outline-offset-2 disabled:bg-[#3A3A3A] disabled:text-[#6B6B6B] disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>Gửi ►</>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
