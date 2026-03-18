"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type UseInfiniteScrollOptions<T> = {
  initialData: T[];
  initialCursor: string | null;
  fetchMore: (cursor: string) => Promise<{ items: T[]; nextCursor: string | null }>;
};

type UseInfiniteScrollReturn<T> = {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  sentinelRef: (node: HTMLElement | null) => void;
  reset: (newItems: T[], newCursor: string | null) => void;
};

export function useInfiniteScroll<T>({
  initialData,
  initialCursor,
  fetchMore,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialData);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  const hasMore = cursor !== null;

  const loadMore = useCallback(async () => {
    if (!cursor || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const result = await fetchMore(cursor);
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    } catch {
      // Keep existing items on error
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [cursor, fetchMore]);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const reset = useCallback((newItems: T[], newCursor: string | null) => {
    setItems(newItems);
    setCursor(newCursor);
  }, []);

  return { items, loading, hasMore, sentinelRef, reset };
}
