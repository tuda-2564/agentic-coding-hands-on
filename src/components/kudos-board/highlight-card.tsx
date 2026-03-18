import Icon from "@/components/ui/icon";
import UserInfo from "@/components/kudos-board/user-info";
import HashtagList from "@/components/kudos-board/hashtag-list";
import { formatHeartCount, formatKudoTimestamp } from "@/utils/format";
import type { KudoHighlight } from "@/types/kudos";

type HighlightCardProps = {
  kudo: KudoHighlight;
  onHashtagClick?: (hashtag: string) => void;
  onCopyLink?: (kudoId: string) => void;
  onViewDetail?: (kudoId: string) => void;
};

export default function HighlightCard({
  kudo,
  onHashtagClick,
  onCopyLink,
  onViewDetail,
}: HighlightCardProps) {
  return (
    <div className="w-[calc(100vw-32px)] md:w-100 lg:w-132 shrink-0 flex flex-col gap-4 px-4 pt-4 md:px-6 md:pt-6 pb-4 bg-kudos-cream border-4 border-kudos-gold rounded-2xl">
      {/* Sender → Receiver */}
      <div className="flex items-center gap-3">
        <UserInfo
          avatarUrl={kudo.sender_avatar_url}
          fullName={kudo.sender_full_name}
          department={kudo.sender_department}
          starCount={kudo.sender_star_count}
          danhHieu={kudo.sender_danh_hieu}
          avatarSize={40}
        />
        <Icon name="arrow-right" size={16} className="shrink-0 opacity-50" />
        {kudo.receivers.map((receiver) => (
          <UserInfo
            key={receiver.user_id}
            avatarUrl={receiver.avatar_url}
            fullName={receiver.full_name}
            department={receiver.department}
            starCount={receiver.star_count}
            danhHieu={receiver.danh_hieu}
            avatarSize={40}
          />
        ))}
      </div>

      {/* Timestamp */}
      <p className="text-sm text-[#999]">
        {formatKudoTimestamp(kudo.created_at)}
      </p>

      {/* Content — 3-line truncation */}
      <p className="text-base text-navy line-clamp-3">
        {kudo.content ?? kudo.message ?? ""}
      </p>

      {/* Hashtags */}
      <HashtagList
        hashtags={kudo.hashtags ?? []}
        onHashtagClick={onHashtagClick}
      />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#00101A]/10">
        <div className="flex items-center gap-1">
          <Icon
            name="heart"
            size={20}
            className={kudo.is_liked_by_me ? "" : "opacity-40 grayscale"}
          />
          <span className="text-sm font-bold text-[#00101A]">
            {formatHeartCount(kudo.heart_count)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onCopyLink?.(kudo.id)}
            className="flex items-center gap-1 text-sm font-medium text-[#00101A] cursor-pointer hover:opacity-70 transition-opacity"
          >
            <Icon name="link" size={16} />
            Copy Link
          </button>
          <button
            type="button"
            onClick={() => onViewDetail?.(kudo.id)}
            className="text-sm font-medium text-[#00101A] cursor-pointer hover:underline"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
