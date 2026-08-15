"use client";

import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import MediaCard from "./MediaCard";

export default function BrowseGrid({
  title,
  items,
}: {
  title: string;
  items: MediaItem[];
}) {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-black">{title}</h1>
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
    </div>
  );
}
