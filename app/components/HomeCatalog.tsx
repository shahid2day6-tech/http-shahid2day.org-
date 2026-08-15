"use client";

import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import Hero from "./Hero";
import MediaRow from "./MediaRow";

export default function HomeCatalog({
  trending,
  movies,
  series,
  anime,
  arabic,
  turkish,
  asian,
}: {
  trending: MediaItem[];
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
  arabic: MediaItem[];
  turkish: MediaItem[];
  asian: MediaItem[];
}) {
  const { t } = useLang();

  return (
    <>
      <Hero items={trending} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MediaRow title={t("trending")} items={trending} />
        <MediaRow title={t("latestMovies")} href="/movies" items={movies} />
        <MediaRow title={t("latestSeries")} href="/series" items={series} />
        <MediaRow title={t("anime")} href="/anime" items={anime} />
        <MediaRow title={t("arabic")} href="/arabic" items={arabic} />
        <MediaRow title={t("turkish")} href="/turkish" items={turkish} />
        <MediaRow title={t("asian")} href="/asian" items={asian} />
      </div>
    </>
  );
}
