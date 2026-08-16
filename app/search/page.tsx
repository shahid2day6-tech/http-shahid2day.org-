"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import BrowseGrid from "../components/BrowseGrid";
import { SearchDropdownAd } from "../components/ads/SearchDropdownAd";

type SearchKind = "all" | "movie" | "tv";
type SearchSort = "relevant" | "year" | "rating";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const { lang, t } = useLang();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [kind, setKind] = useState<SearchKind>("all");
  const [sort, setSort] = useState<SearchSort>("relevant");

  useEffect(() => {
    setKind("all");
    setSort("relevant");
    if (q.trim().length < 2) {
      setItems([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${lang}`)
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((data) => setItems(data.results ?? []))
      .finally(() => setLoading(false));
  }, [q, lang]);

  const filtered = useMemo(() => {
    const list = kind === "all" ? items : items.filter((item) => item.type === kind);
    if (sort === "year") {
      return [...list].sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    }
    if (sort === "rating") {
      return [...list].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }
    return list;
  }, [items, kind, sort]);

  const kinds: { id: SearchKind; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "movie", label: t("movies") },
    { id: "tv", label: t("series") },
  ];
  const sorts: { id: SearchSort; label: string }[] = [
    { id: "relevant", label: t("searchBtn") },
    { id: "year", label: t("sortLatest") },
    { id: "rating", label: t("sortRating") },
  ];

  if (q.trim().length < 2) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-black">{t("search")}</h1>
        <p className="mt-2 text-sm text-[#a3a3a3]">{t("searchHint")}</p>
        <div className="mt-6">
          <SearchDropdownAd />
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="mx-auto max-w-7xl px-4 py-16 text-[#a3a3a3]">{t("loading")}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {kinds.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setKind(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-black ${
              kind === item.id ? "bg-[#e50914] text-white" : "bg-[#1a1a1a] text-[#d4d4d4]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {sorts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSort(item.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
              sort === item.id ? "bg-[#2a2a2a] text-white" : "bg-[#141414] text-[#a3a3a3]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mb-6 flex justify-center">
        <SearchDropdownAd />
      </div>
      <BrowseGrid
        title={`${t("search")}: ${q}`}
        items={filtered}
        showFilters={false}
        totalResults={filtered.length}
        embedded
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-[#a3a3a3]">...</p>}>
      <SearchResults />
    </Suspense>
  );
}
