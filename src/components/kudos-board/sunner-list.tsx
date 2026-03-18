import SunnerItem from "@/components/kudos-board/sunner-item";

export function SunnerListSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 p-6 pr-4 bg-kudos-container-2 border border-kudos-border rounded-[17px] animate-pulse" aria-hidden="true">
      <div className="h-7 w-3/4 rounded bg-kudos-divider" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-full bg-kudos-divider shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3.5 w-28 rounded bg-kudos-divider" />
            <div className="h-3 w-20 rounded bg-kudos-divider" />
          </div>
        </div>
      ))}
    </div>
  );
}

type SunnerListItem = {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  description: string;
};

type SunnerListProps = {
  title: string;
  items: SunnerListItem[];
};

export default function SunnerList({ title, items }: SunnerListProps) {
  return (
    <div className="flex flex-col gap-2.5 p-6 pr-4 bg-kudos-container-2 border border-kudos-border rounded-[17px]">
      <h3 className="text-[22px] font-bold text-kudos-gold leading-7">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-[#999] py-4">Chưa có dữ liệu</p>
      ) : (
        items.map((item) => (
          <SunnerItem
            key={item.user_id}
            avatarUrl={item.avatar_url}
            name={item.full_name}
            description={item.description}
          />
        ))
      )}
    </div>
  );
}
