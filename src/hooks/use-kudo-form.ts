"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/client";
import type { Badge, Colleague } from "@/types/kudos";

type FieldErrors = Record<string, string>;

type UseKudoFormOptions = {
  onSuccess: () => void;
};

type UseKudoFormReturn = {
  // State
  recipients: Colleague[];
  selectedBadge: Badge | null;
  content: string;
  hashtags: string[];
  images: File[];
  isSubmitting: boolean;
  submitError: string | null;
  fieldErrors: FieldErrors;
  // Actions
  addRecipient: (colleague: Colleague) => void;
  removeRecipient: (id: string) => void;
  setBadge: (badge: Badge | null) => void;
  setContent: (html: string) => void;
  addHashtag: (tag: string) => void;
  removeHashtag: (tag: string) => void;
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  submit: () => Promise<void>;
  reset: () => void;
};

export function useKudoForm({ onSuccess }: UseKudoFormOptions): UseKudoFormReturn {
  const router = useRouter();

  const [recipients, setRecipients] = useState<Colleague[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [content, setContentState] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const addRecipient = (colleague: Colleague) => {
    setRecipients((prev) =>
      prev.some((r) => r.id === colleague.id) ? prev : [...prev, colleague]
    );
  };

  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const setBadge = (badge: Badge | null) => setSelectedBadge(badge);

  const setContent = (html: string) => setContentState(html);

  const addHashtag = (tag: string) => {
    setHashtags((prev) => (prev.includes(tag) || prev.length >= 5 ? prev : [...prev, tag]));
  };

  const removeHashtag = (tag: string) => {
    setHashtags((prev) => prev.filter((h) => h !== tag));
  };

  const addImages = (files: File[]) => {
    setImages((prev) => {
      const remaining = 5 - prev.length;
      return [...prev, ...files.slice(0, remaining)];
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (recipients.length === 0) {
      errors.recipients = "Vui lòng chọn ít nhất một người nhận";
    }
    if (!selectedBadge) {
      errors.badge = "Vui lòng chọn danh hiệu";
    }
    const plainText = content.replace(/<[^>]+>/g, "").trim();
    if (!plainText) {
      errors.content = "Vui lòng nhập nội dung kudo";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const supabase = createClient();
    const uploadedUrls: string[] = [];

    await Promise.allSettled(
      files.map(async (file) => {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data, error } = await supabase.storage
          .from("kudos-images")
          .upload(path, file);

        if (error || !data) return; // Partial failure — continue

        const { data: urlData } = supabase.storage
          .from("kudos-images")
          .getPublicUrl(data.path);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      })
    );

    return uploadedUrls;
  };

  const submit = async (): Promise<void> => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    // AbortController with 10s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      // Upload images in parallel (partial failure is non-blocking)
      const imageUrls = await uploadImages(images);

      const response = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_ids: recipients.map((r) => r.id),
          recipient_full_names: recipients.map((r) => r.full_name),
          badge_id: selectedBadge!.id,
          content,
          hashtags,
          image_urls: imageUrls,
        }),
        signal: controller.signal,
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 422) {
        const body = (await response.json()) as { errors?: { field: string; message: string }[] };
        const errors: FieldErrors = {};
        for (const err of body.errors ?? []) {
          errors[err.field] = err.message;
        }
        setFieldErrors(errors);
        return;
      }

      if (!response.ok) {
        setSubmitError("Gửi kudo thất bại. Vui lòng thử lại.");
        return;
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setSubmitError("Gửi kudo quá thời gian. Vui lòng thử lại.");
      } else {
        setSubmitError("Gửi kudo thất bại. Vui lòng thử lại.");
      }
    } finally {
      clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setRecipients([]);
    setSelectedBadge(null);
    setContentState("");
    setHashtags([]);
    setImages([]);
    setIsSubmitting(false);
    setSubmitError(null);
    setFieldErrors({});
  };

  return {
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
  };
}
