import Image from "next/image";

type SunnerItemProps = {
  avatarUrl: string | null;
  name: string;
  description: string;
};

export default function SunnerItem({
  avatarUrl,
  name,
  description,
}: SunnerItemProps) {
  return (
    <div className="flex items-center gap-2 h-16 cursor-pointer hover:opacity-80 transition-opacity">
      <Image
        src={avatarUrl ?? "/icons/hamburger.svg"}
        alt={name}
        width={40}
        height={40}
        className="rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-bold text-white truncate">{name}</span>
        <span className="text-sm text-[#999] truncate">{description}</span>
      </div>
    </div>
  );
}
