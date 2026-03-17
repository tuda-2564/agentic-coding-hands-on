"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

type SidebarCategory = {
  id: string;
  name: string;
};

type AwardSidebarProps = {
  categories: SidebarCategory[];
};

export default function AwardSidebar({ categories }: AwardSidebarProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && categories.some((c) => c.id === hash)) {
      setActiveId(hash);
    }
  }, [categories]);

  useEffect(() => {
    const sectionElements = categories
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    const visibleSections = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }

        if (visibleSections.size > 0) {
          const categoryIds = categories.map((c) => c.id);
          const topmost = categoryIds.find((id) => visibleSections.has(id));
          if (topmost) {
            setActiveId(topmost);
          }
        }
      },
      {
        rootMargin: "-64px 0px -50% 0px",
        threshold: [0, 0.3],
      }
    );

    for (const el of sectionElements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [categories]);

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    setActiveId(id);
    isClickScrolling.current = true;

    element.scrollIntoView({ behavior: "smooth", block: "start" });

    history.replaceState(null, "", `#${id}`);

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 500);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Danh mục giải thưởng"
      className="hidden lg:flex flex-col sticky top-16 self-start shrink-0 w-[178px]"
    >
      {categories.map((category) => {
        const isActive = activeId === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => handleClick(category.id)}
            aria-current={isActive ? "true" : undefined}
            className={`flex items-center gap-1 p-4 rounded text-sm font-bold leading-5 tracking-[0.25px] text-left transition-colors duration-200 min-h-[44px] ${
              isActive
                ? "text-[#FFEA9E] [text-shadow:0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]"
                : "text-white hover:text-[#FFEA9E]"
            }`}
          >
            <Icon name="target" size={24} className="shrink-0" />
            <span>{category.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
