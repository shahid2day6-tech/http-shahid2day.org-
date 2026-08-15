"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "../context/LanguageContext";
import { browseHeading, isCatalogSort, type CatalogSort } from "../lib/filters";
import type { DiscoverResult } from "../lib/tmdb";
import BrowseGrid from "./BrowseGrid";
import CatalogToolbar from "./CatalogToolbar";

export default function FilteredBrowse({
  initial,
  sort,
  section,
  genre,
  year,
}: {
  initial: DiscoverResult;
  sort: CatalogSort;
  section: string;
  genre: string;
  year: string;
}) {
  const searchParams = useSearchParams();
  const { t, lang } = useLang();
  const sortParam = searchParams.get("sort");
  const liveSort: CatalogSort = isCatalogSort(sortParam) ? sortParam : sort;
  const liveSection = searchParams.get("section") ?? section;
  const liveGenre = searchParams.get("genre") ?? genre;
  const liveYear = searchParams.get("year") ?? year;
  const queryKey = `${liveSort}|${liveSection}|${liveGenre}|${liveYear}|${lang}`;
  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    let cancelled = false;
    const keepSeed = firstLoad.current;
    firstLoad.current = false;
    if (!keepSeed) {
      setResult({ items: [], page: 1, totalPages: 1, totalResults: 0 });
    }
    setLoading(true);
    const params = new URLSearchParams({ page: "1", lang, sort: liveSort });
    if (liveSection && liveSection !== "all") params.set("section", liveSection);
    if (liveGenre) params.set("genre", liveGenre);
    if (liveYear && liveYear !== "all") params.set("year", liveYear);
    void fetch(`/api/discover?${params.toString()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { results?: DiscoverResult["items"]; totalPages?: number; totalResults?: number; page?: number }) => {
        if (cancelled) return;
        setResult({
          items: data.results ?? [],
          page: data.page ?? 1,
          totalPages: data.totalPages ?? 1,
          totalResults: data.totalResults ?? 0,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [queryKey, lang, liveGenre, liveSection, liveSort, liveYear]);

  const heading = useMemo(
    () => browseHeading(t, liveSort, liveSection, liveGenre, liveYear),
    [t, liveSort, liveSection, liveGenre, liveYear]
  );

  return (
    <div className={loading ? "opacity-60" : ""}>
      <CatalogToolbar sort={liveSort} section={liveSection} genre={liveGenre} year={liveYear} />
      <BrowseGrid
        title={heading}
        embedded
        showFilters={false}
        query={{ sort: liveSort, section: liveSection, genre: liveGenre, year: liveYear }}
        initialItems={result.items}
        initialPage={result.page}
        totalPages={result.totalPages}
        totalResults={result.totalResults}
      />
    </div>
  );
}
