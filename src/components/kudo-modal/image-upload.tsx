"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type ImageUploadProps = {
  images: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
};

export default function ImageUpload({
  images,
  onAdd,
  onRemove,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep previews in sync with images
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Định dạng không hợp lệ`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        errors.push(`${file.name}: Tệp vượt quá 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (errors.length > 0) {
      setUploadError(errors.join(". "));
    }

    if (validFiles.length > 0) {
      onAdd(validFiles);
    }

    // Reset file input to allow re-selecting the same file
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onRemove(index);
  };

  const atMax = images.length >= MAX_IMAGES;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Image thumbnails */}
        {previews.map((src, i) => (
          <div key={i} className="relative">
            <Image
              src={src}
              alt={`Ảnh ${i + 1}`}
              width={64}
              height={64}
              className="w-14 h-14 md:w-16 md:h-16 object-cover rounded border border-[#1E3448]"
              unoptimized
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#EF4444] rounded-full text-white text-[10px] flex items-center justify-center leading-none hover:bg-red-600 transition-colors"
              aria-label={`Xóa ảnh ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}

        {/* Add image button */}
        {!atMax && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 md:w-16 md:h-16 bg-[#0F2333] border border-dashed border-[#1E3448] rounded flex items-center justify-center text-[#6B8A9A] hover:border-gold hover:text-gold transition-colors text-xl leading-none"
              aria-label="Thêm ảnh"
            >
              +
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              multiple
              onChange={handleFileSelect}
              className="sr-only"
              aria-hidden="true"
            />
          </>
        )}
      </div>

      {uploadError && (
        <p role="alert" className="text-xs text-[#EF4444]">
          {uploadError}
        </p>
      )}
    </div>
  );
}
