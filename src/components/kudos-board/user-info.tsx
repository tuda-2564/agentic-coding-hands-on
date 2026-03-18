import Image from "next/image";
import Icon from "@/components/ui/icon";

type UserInfoProps = {
  avatarUrl: string | null;
  fullName: string;
  department?: string;
  starCount?: number;
  danhHieu?: string;
  avatarSize?: number;
  onClick?: () => void;
};

export default function UserInfo({
  avatarUrl,
  fullName,
  department,
  starCount,
  danhHieu,
  avatarSize = 48,
  onClick,
}: UserInfoProps) {
  const content = (
    <div className="flex items-center gap-2">
      <Image
        src={avatarUrl ?? "/icons/hamburger.svg"}
        alt={fullName}
        width={avatarSize}
        height={avatarSize}
        className="rounded-full object-cover shrink-0"
        style={{ width: avatarSize, height: avatarSize }}
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-bold text-[#00101A] truncate">
          {fullName}
        </span>
        {department && (
          <span className="text-sm text-[#999] truncate">{department}</span>
        )}
        {(starCount !== undefined || danhHieu) && (
          <div className="flex items-center gap-1">
            {starCount !== undefined && (
              <span className="flex items-center gap-0.5 text-sm font-bold text-kudos-gold">
                <Icon name="star" size={14} alt="" className="shrink-0" />
                {starCount}
              </span>
            )}
            {danhHieu && (
              <span className="text-sm text-[#999]">{danhHieu}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer text-left"
      >
        {content}
      </button>
    );
  }

  return content;
}
