import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  children?: ReactNode;
};

export default function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="px-4 md:px-12 lg:px-[144px]">
      <p className="text-2xl font-bold text-white mb-2 leading-8">
        Sun* Annual Awards 2025
      </p>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <h2 className="text-3xl md:text-4xl lg:text-[57px] font-bold text-kudos-gold leading-tight lg:leading-[64px] tracking-[-0.25px]">
          {title}
        </h2>
        {children && (
          <div className="flex items-center gap-6">{children}</div>
        )}
      </div>
    </div>
  );
}
