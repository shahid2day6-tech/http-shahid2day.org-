"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import BrowseGrid from "../components/BrowseGrid";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const { lang, t } = useLang();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  if (loading) {
    return <p className="mx-auto max-w-7xl px-4 py-16 text-[#a3a3a3]">{t("loading")}</p>;
  }

  return <BrowseGrid title={`${t("search")}: ${q}`} items={items} />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-[#a3a3a3]">...</p>}>
      <SearchResults />
    </Suspense>
  );
}
