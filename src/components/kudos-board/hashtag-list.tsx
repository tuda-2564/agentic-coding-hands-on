type HashtagListProps = {
  hashtags: string[];
  maxVisible?: number;
  onHashtagClick?: (hashtag: string) => void;
};

export default function HashtagList({
  hashtags,
  maxVisible = 5,
  onHashtagClick,
}: HashtagListProps) {
  if (hashtags.length === 0) return null;

  const visible = hashtags.slice(0, maxVisible);
  const hasOverflow = hashtags.length > maxVisible;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onHashtagClick?.(tag)}
          className="text-sm font-bold text-[#00101A] cursor-pointer hover:underline"
        >
          #{tag}
        </button>
      ))}
      {hasOverflow && (
        <span className="text-sm text-[#999]">...</span>
      )}
    </div>
  );
}
