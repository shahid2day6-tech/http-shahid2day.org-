"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CategoryKey, MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaCard from "./MediaCard";

export default function BrowseGrid({
  title,
  category,
  items: staticItems,
  initialItems,
  initialPage = 1,
  totalPages = 1,
  totalResults,
}: {
  title: string;
  category?: CategoryKey;
  items?: MediaItem[];
  initialItems?: MediaItem[];
  initialPage?: number;
  totalPages?: number;
  totalResults?: number;
}) {
  const { t, lang } = useLang();
  const seed = initialItems ?? staticItems ?? [];
  const [items, setItems] = useState(seed);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(totalPages);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const total = totalResults ?? items.length;

  const hasMore = Boolean(category) && page < pages;

  useEffect(() => {
    if (!category) setItems(staticItems ?? []);
  }, [category, staticItems]);

  const loadMore = useCallback(async () => {
    if (!category || loadingRef.current || page >= pages) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const next = page + 1;
      const res = await fetch(
        `/api/discover?category=${category}&page=${next}&lang=${lang}`
      );
      const data = (await res.json()) as {
        results?: MediaItem[];
        totalPages?: number;
      };
      const incoming = data.results ?? [];
      setItems((prev) => {
        const seen = new Set(prev.map((item) => `${item.type}-${item.id}`));
        return [
          ...prev,
          ...incoming.filter((item) => !seen.has(`${item.type}-${item.id}`)),
        ];
      });
      setPage(next);
      if (data.totalPages) setPages(data.totalPages);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [category, lang, page, pages]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "900px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mt-1 text-sm text-[#a3a3a3]">
            {t("showingCount")
              .replace("{count}", String(items.length))
              .replace("{total}", String(total.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")))}
          </p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-[#a3a3a3]">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <MediaCard
              key={`${item.type}-${item.id}`}
              item={item}
              movieLabel={t("movie")}
              showLabel={t("show")}
            />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-8" />
      <div className="mt-4 flex justify-center pb-8">
        {loading ? (
          <p className="text-sm font-bold text-[#a3a3a3]">{t("loadingMore")}</p>
        ) : hasMore ? (
          <button type="button" onClick={() => void loadMore()} className="btn-red px-6 py-2 text-sm">
            {t("loadMore")}
          </button>
        ) : items.length > 0 && category ? (
          <p className="text-sm font-bold text-[#a3a3a3]">{t("allLoaded")}</p>
        ) : null}
      </div>
    </div>
  );
}
