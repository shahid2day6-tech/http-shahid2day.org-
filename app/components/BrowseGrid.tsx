"use client";

import { useCallback, useState } from "react";
import type { CatalogGroup, CatalogKind } from "../lib/catalog";
import type { CategoryKey, MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaCard from "./MediaCard";

function paginationItems(current: number, total: number): (number | "gap")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, "gap", total];
  }
  if (current >= total - 2) {
    return [1, "gap", total - 2, total - 1, total];
  }
  return [current, current + 1, current + 2, "gap", total];
}

export default function BrowseGrid({
  title,
  category,
  kind,
  group,
  items: staticItems,
  initialItems,
  initialPage = 1,
  totalPages = 1,
  totalResults,
}: {
  title: string;
  category?: CategoryKey;
  kind?: CatalogKind;
  group?: CatalogGroup;
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
  const total = totalResults ?? items.length;
  const canPage = Boolean(category || (kind && group));

  const goTo = useCallback(
    async (next: number) => {
      if (!canPage || loading || next < 1 || next > pages || next === page) return;
      setLoading(true);
      try {
        const query =
          kind && group
            ? `kind=${kind}&group=${group}&page=${next}&lang=${lang}`
            : `category=${category}&page=${next}&lang=${lang}`;
        const res = await fetch(`/api/discover?${query}`);
        const data = (await res.json()) as {
          results?: MediaItem[];
          totalPages?: number;
        };
        setItems(data.results ?? []);
        setPage(next);
        if (data.totalPages) setPages(data.totalPages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } finally {
        setLoading(false);
      }
    },
    [canPage, category, group, kind, lang, loading, page, pages]
  );

  const numbers = paginationItems(page, pages);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="mt-1 text-sm text-[#a3a3a3]">
          {t("showingCount")
            .replace("{count}", String(items.length))
            .replace("{total}", String(total.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")))}
        </p>
      </div>
      {items.length === 0 ? (
        <p className="text-[#a3a3a3]">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
      {canPage && pages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 pb-8">
          {numbers.map((item, index) =>
            item === "gap" ? (
              <span
                key={`gap-${index}`}
                className="flex h-10 min-w-10 items-center justify-center rounded-md bg-[#2a2a2a] px-3 text-sm font-black text-white"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => void goTo(item)}
                disabled={loading}
                className={`flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-black text-white ${
                  item === page ? "bg-[#e06c5c]" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                }`}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => void goTo(Math.min(pages, page + 1))}
            disabled={loading || page >= pages}
            className="flex h-10 min-w-10 items-center justify-center rounded-md bg-[#2a2a2a] px-3 text-sm font-black text-white hover:bg-[#3a3a3a] disabled:opacity-40"
            aria-label="next"
          >
            «
          </button>
        </div>
      )}
    </div>
  );
}
