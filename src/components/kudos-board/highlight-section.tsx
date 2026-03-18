"use client";

import { useState, useCallback, useEffect } from "react";
import SectionHeader from "@/components/kudos-board/section-header";
import FilterButton from "@/components/kudos-board/filter-button";
import KudoCarousel from "@/components/kudos-board/kudo-carousel";
import CarouselPagination from "@/components/kudos-board/carousel-pagination";
import { useCarousel } from "@/hooks/use-carousel";
import type { KudoHighlight } from "@/types/kudos";

function HighlightSkeleton() {
  return (
    <div className="px-4 md:px-12 lg:px-36 flex gap-6 overflow-hidden" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[calc(100vw-32px)] md:w-100 lg:w-132 shrink-0 h-80 rounded-[17px] bg-kudos-container-2 border border-kudos-border animate-pulse flex flex-col gap-4 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-kudos-divider" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-32 rounded bg-kudos-divider" />
              <div className="h-3 w-24 rounded bg-kudos-divider" />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-kudos-divider" />
            <div className="h-3 w-4/5 rounded bg-kudos-divider" />
            <div className="h-3 w-3/5 rounded bg-kudos-divider" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-kudos-divider" />
            <div className="h-6 w-20 rounded-full bg-kudos-divider" />
          </div>
        </div>
      ))}
    </div>
  );
}

type HighlightSectionProps = {
  initialHighlights: KudoHighlight[];
};

export default function HighlightSection({
  initialHighlights,
}: HighlightSectionProps) {
  const [highlights, setHighlights] =
    useState<KudoHighlight[]>(initialHighlights);
  const [hashtagFilter, setHashtagFilter] = useState<string | undefined>();
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [hashtagsLoading, setHashtagsLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carousel = useCarousel({ totalItems: highlights.length });

  // Refetch highlights when filters change
  useEffect(() => {
    if (hashtagFilter === undefined && departmentFilter === undefined) {
      setHighlights(initialHighlights);
      setError(null);
      carousel.reset();
      return;
    }

    setFilterLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (hashtagFilter) params.set("hashtag", hashtagFilter);
    if (departmentFilter) params.set("department", departmentFilter);

    fetch(`/api/kudos/highlight?${params.toString()}`)
      .then((res) => res.json() as Promise<KudoHighlight[]>)
      .then((data) => {
        setHighlights(data);
        carousel.reset();
      })
      .catch(() => {
        setHighlights([]);
        setError("Không thể tải highlight kudos. Vui lòng thử lại.");
      })
      .finally(() => setFilterLoading(false));
  }, [hashtagFilter, departmentFilter, initialHighlights, carousel]);

  const loadHashtags = useCallback(async () => {
    if (hashtags.length > 0) return;
    setHashtagsLoading(true);
    try {
      const res = await fetch("/api/hashtags");
      const data = (await res.json()) as string[];
      setHashtags(data);
    } catch {
      setHashtags([]);
    } finally {
      setHashtagsLoading(false);
    }
  }, [hashtags.length]);

  const loadDepartments = useCallback(async () => {
    if (departments.length > 0) return;
    setDepartmentsLoading(true);
    try {
      const res = await fetch("/api/departments");
      const data = (await res.json()) as { name: string }[];
      setDepartments(data.map((d) => d.name));
    } catch {
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  }, [departments.length]);

  const handleHashtagClick = useCallback((hashtag: string) => {
    setHashtagFilter(hashtag);
  }, []);

  const handleCopyLink = useCallback((kudoId: string) => {
    const url = `${window.location.origin}/kudos#${kudoId}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }, []);

  const handleViewDetail = useCallback((kudoId: string) => {
    document.getElementById(kudoId)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (highlights.length === 0 && !hashtagFilter && !departmentFilter && !filterLoading) {
    return null;
  }

  return (
    <section className="flex flex-col gap-10">
      <SectionHeader title="HIGHLIGHT KUDOS">
        <FilterButton
          label="Hashtag"
          options={hashtags}
          value={hashtagFilter}
          onSelect={setHashtagFilter}
          loading={hashtagsLoading}
          onOpen={loadHashtags}
        />
        <FilterButton
          label="Phòng ban"
          options={departments}
          value={departmentFilter}
          onSelect={setDepartmentFilter}
          loading={departmentsLoading}
          onOpen={loadDepartments}
        />
      </SectionHeader>

      {filterLoading ? (
        <HighlightSkeleton />
      ) : error ? (
        <div className="px-4 md:px-12 lg:px-36">
          <div className="flex flex-col items-center gap-4 rounded-[17px] border border-kudos-border bg-kudos-container-2 p-6 text-center">
            <p className="text-sm text-[#999]">{error}</p>
            <button
              type="button"
              onClick={() => {
                setHashtagFilter(undefined);
                setDepartmentFilter(undefined);
              }}
              className="rounded-md bg-kudos-gold px-4 py-2 text-sm font-bold text-[#00101A] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : null}

      {!filterLoading && !error && (
        <>
          <KudoCarousel
            highlights={highlights}
            currentIndex={carousel.currentIndex}
            onPrev={carousel.goToPrev}
            onNext={carousel.goToNext}
            canPrev={carousel.canPrev}
            canNext={carousel.canNext}
            onTouchStart={carousel.handleTouchStart}
            onTouchEnd={carousel.handleTouchEnd}
            onHashtagClick={handleHashtagClick}
            onCopyLink={handleCopyLink}
            onViewDetail={handleViewDetail}
          />

          <CarouselPagination
            current={carousel.currentIndex + 1}
            total={highlights.length}
            onPrev={carousel.goToPrev}
            onNext={carousel.goToNext}
            canPrev={carousel.canPrev}
            canNext={carousel.canNext}
          />
        </>
      )}
    </section>
  );
}
