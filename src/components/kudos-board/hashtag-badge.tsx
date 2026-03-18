type HashtagBadgeProps = {
  hashtag: string;
  onClick?: (hashtag: string) => void;
};

export default function HashtagBadge({ hashtag, onClick }: HashtagBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(hashtag)}
      className="inline-flex items-center px-2 py-1 bg-kudos-gold rounded text-sm font-bold text-[#00101A] cursor-pointer hover:opacity-80 transition-opacity"
    >
      {hashtag}
    </button>
  );
}
