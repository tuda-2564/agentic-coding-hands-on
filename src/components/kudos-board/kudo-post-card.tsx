import Icon from "@/components/ui/icon";
import UserInfo from "@/components/kudos-board/user-info";
import HashtagBadge from "@/components/kudos-board/hashtag-badge";
import HashtagList from "@/components/kudos-board/hashtag-list";
import ImageGallery from "@/components/kudos-board/image-gallery";
import HeartButton from "@/components/kudos-board/heart-button";
import CopyLinkButton from "@/components/kudos-board/copy-link-button";
import { formatKudoTimestamp, stripHtml } from "@/utils/format";
import type { KudoHighlight } from "@/types/kudos";

type KudoPostCardProps = {
  kudo: KudoHighlight;
  onHashtagClick?: (hashtag: string) => void;
};

export default function KudoPostCard({
  kudo,
  onHashtagClick,
}: KudoPostCardProps) {
  const primaryHashtag = kudo.hashtags?.[0];
  const restHashtags = kudo.hashtags?.slice(1) ?? [];

  return (
    <article
      id={kudo.id}
      className="flex flex-col gap-4 px-6 pt-6 md:px-10 md:pt-10 pb-4 bg-kudos-cream rounded-3xl w-full"
    >
      {/* Sender → Receiver(s) */}
      <div className="flex items-center gap-4 flex-wrap">
        <UserInfo
          avatarUrl={kudo.sender_avatar_url}
          fullName={kudo.sender_full_name}
          department={kudo.sender_department}
          starCount={kudo.sender_star_count}
          danhHieu={kudo.sender_danh_hieu}
          avatarSize={48}
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
            avatarSize={48}
          />
        ))}
      </div>

      {/* Primary hashtag badge + timestamp */}
      <div className="flex items-center gap-3 flex-wrap">
        {primaryHashtag && (
          <HashtagBadge
            hashtag={primaryHashtag}
            onClick={onHashtagClick}
          />
        )}
        <span className="text-sm text-[#999]">
          {formatKudoTimestamp(kudo.created_at)}
        </span>
      </div>

      {/* Content — 5-line truncation (plain text, HTML stripped for XSS safety per SC-006) */}
      <p className="text-base text-navy line-clamp-5 whitespace-pre-line">
        {stripHtml(kudo.content ?? kudo.message ?? "")}
      </p>

      {/* Image gallery */}
      <ImageGallery imageUrls={kudo.image_urls ?? []} />

      {/* Hashtag list */}
      <HashtagList
        hashtags={restHashtags}
        onHashtagClick={onHashtagClick}
      />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#00101A]/10">
        <HeartButton
          kudoId={kudo.id}
          initialLiked={kudo.is_liked_by_me ?? false}
          initialCount={kudo.heart_count}
        />
        <CopyLinkButton kudoId={kudo.id} />
      </div>
    </article>
  );
}
