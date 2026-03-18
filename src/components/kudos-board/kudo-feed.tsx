"use client";

import { useCallback, useState } from "react";
import KudoPostCard from "@/components/kudos-board/kudo-post-card";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { KudoHighlight } from "@/types/kudos";

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-[17px] bg-kudos-container-2 border border-kudos-border animate-pulse p-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-kudos-divider" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-40 rounded bg-kudos-divider" />
              <div className="h-3 w-28 rounded bg-kudos-divider" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-kudos-divider" />
            <div className="h-3 w-5/6 rounded bg-kudos-divider" />
            <div className="h-3 w-3/4 rounded bg-kudos-divider" />
            <div className="h-3 w-2/3 rounded bg-kudos-divider" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-kudos-divider" />
            <div className="h-6 w-20 rounded-full bg-kudos-divider" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-14 rounded bg-kudos-divider" />
            <div className="h-5 w-20 rounded bg-kudos-divider" />
          </div>
        </div>
      ))}
    </div>
  );
}

type KudoFeedProps = {
  initialKudos: KudoHighlight[];
  initialCursor: string | null;
  onHashtagClick?: (hashtag: string) => void;
};

export default function KudoFeed({
  initialKudos,
  initialCursor,
  onHashtagClick,
}: KudoFeedProps) {
  const [activeHashtag, setActiveHashtag] = useState<string | undefined>();
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMore = useCallback(
    async (cursor: string) => {
      const params = new URLSearchParams({ cursor, limit: "10" });
      if (activeHashtag) params.set("hashtag", activeHashtag);
      const res = await fetch(`/api/kudos?${params.toString()}`);
      const data = (await res.json()) as {
        kudos: KudoHighlight[];
        nextCursor: string | null;
      };
      return { items: data.kudos, nextCursor: data.nextCursor };
    },
    [activeHashtag]
  );

  const { items, loading, hasMore, sentinelRef, reset } =
    useInfiniteScroll<KudoHighlight>({
      initialData: initialKudos,
      initialCursor,
      fetchMore,
    });

  const handleHashtagClick = useCallback(
    (hashtag: string) => {
      const newTag = activeHashtag === hashtag ? undefined : hashtag;
      setActiveHashtag(newTag);
      onHashtagClick?.(hashtag);

      // Refetch with filter
      setFilterLoading(true);
      setError(null);
      const params = new URLSearchParams({ limit: "10" });
      if (newTag) params.set("hashtag", newTag);
      fetch(`/api/kudos?${params.toString()}`)
        .then((res) => res.json() as Promise<{ kudos: KudoHighlight[]; nextCursor: string | null }>)
        .then((data) => {
          reset(data.kudos, data.nextCursor);
        })
        .catch(() => {
          setError("Không thể tải kudos. Vui lòng thử lại.");
        })
        .finally(() => setFilterLoading(false));
    },
    [activeHashtag, onHashtagClick, reset]
  );

  if (filterLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[17px] border border-kudos-border bg-kudos-container-2 p-6 text-center">
        <p className="text-sm text-[#999]">{error}</p>
        <button
          type="button"
          onClick={() => {
            setActiveHashtag(undefined);
            setError(null);
          }}
          className="rounded-md bg-kudos-gold px-4 py-2 text-sm font-bold text-navy hover:opacity-90 transition-opacity cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl font-bold text-white mb-2">
          Chưa có kudo nào
        </p>
        <p className="text-[#999]">
          Hãy là người đầu tiên gửi lời cảm ơn!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Active filter chip */}
      {activeHashtag && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#999]">Filtering by:</span>
          <button
            type="button"
            onClick={() => handleHashtagClick(activeHashtag)}
            className="inline-flex items-center gap-1 px-2 py-1 bg-kudos-gold rounded text-sm font-bold text-[#00101A] cursor-pointer"
          >
            #{activeHashtag}
            <span className="ml-1">×</span>
          </button>
        </div>
      )}

      {items.map((kudo) => (
        <ScrollReveal key={kudo.id}>
          <KudoPostCard
            kudo={kudo}
            onHashtagClick={handleHashtagClick}
          />
        </ScrollReveal>
      ))}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {loading && (
            <div className="w-8 h-8 border-2 border-kudos-gold border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
