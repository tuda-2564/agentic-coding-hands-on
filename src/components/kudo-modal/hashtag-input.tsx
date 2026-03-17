"use client";

import { useState, useRef } from "react";

const MAX_HASHTAGS = 5;

type HashtagInputProps = {
  hashtags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

export default function HashtagInput({
  hashtags,
  onAdd,
  onRemove,
}: HashtagInputProps) {
  const [hashtagInput, setHashtagInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sanitiseTag = (raw: string) =>
    raw.replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(sanitiseTag(e.target.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTag();
    }
  };

  const commitTag = () => {
    const tag = hashtagInput.trim();
    if (tag && !hashtags.includes(tag) && hashtags.length < MAX_HASHTAGS) {
      onAdd(tag);
    }
    setHashtagInput("");
    setIsEditing(false);
  };

  const atMax = hashtags.length >= MAX_HASHTAGS;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Existing hashtag pills */}
      {hashtags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 h-7 px-2.5 bg-[#0F2A3D] border border-gold/30 rounded-full text-[13px] font-medium text-gold"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            className="ml-0.5 text-[#B0BEC5] hover:text-white transition-colors leading-none text-xs"
            aria-label={`Xóa hashtag #${tag}`}
          >
            ×
          </button>
        </span>
      ))}

      {/* Inline input when editing */}
      {isEditing && !atMax && (
        <div className="flex items-center h-9 px-3 bg-[#0F2A3D] border border-[#1E3448] rounded-[18px] text-[13px] min-w-[120px]">
          <span className="text-gold mr-1">#</span>
          <input
            ref={inputRef}
            type="text"
            value={hashtagInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={commitTag}
            placeholder="hashtag"
            className="bg-transparent text-white text-[13px] outline-none w-full placeholder:text-[#6B8A9A]"
            aria-label="Nhập hashtag"
            autoFocus
          />
        </div>
      )}

      {/* Add button or max hint */}
      {atMax ? (
        <span className="text-xs text-[#6B8A9A]">Tối đa {MAX_HASHTAGS} hashtag</span>
      ) : !isEditing ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center h-7 px-3 bg-transparent border border-dashed border-gold/50 rounded-full text-[13px] text-gold hover:border-gold transition-colors"
        >
          + Thêm hashtag
        </button>
      ) : null}
    </div>
  );
}
