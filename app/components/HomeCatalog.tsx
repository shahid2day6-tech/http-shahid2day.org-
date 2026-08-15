"use client";

import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import Hero from "./Hero";
import MediaRow from "./MediaRow";
import CatalogToolbar from "./CatalogToolbar";

export default function HomeCatalog({
  trending,
  movies,
  series,
  foreignEpisodes,
  animeEpisodes,
  arabicEpisodes,
  ramadan,
  animeMovies,
  animeSeries,
  arabicMovies,
  arabicSeries,
  turkish,
  asian,
  franchises,
}: {
  trending: MediaItem[];
  movies: MediaItem[];
  series: MediaItem[];
  foreignEpisodes: MediaItem[];
  animeEpisodes: MediaItem[];
  arabicEpisodes: MediaItem[];
  ramadan: MediaItem[];
  animeMovies: MediaItem[];
  animeSeries: MediaItem[];
  arabicMovies: MediaItem[];
  arabicSeries: MediaItem[];
  turkish: MediaItem[];
  asian: MediaItem[];
  franchises: MediaItem[];
}) {
  const { t } = useLang();

  return (
    <>
      <Hero items={trending} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CatalogToolbar />
        <MediaRow title={t("trending")} items={trending} />
        <MediaRow title={t("newForeignEpisodes")} href="/series/foreign" items={foreignEpisodes} />
        <MediaRow title={t("newAnimeEpisodes")} href="/series/anime" items={animeEpisodes} />
        <MediaRow title={t("newArabicEpisodes")} href="/series/arabic" items={arabicEpisodes} />
        <MediaRow title={t("latestMovies")} href="/movies" items={movies} />
        <MediaRow title={t("movieFranchises")} href="/movies/franchises" items={franchises} />
        <MediaRow title={t("latestSeries")} href="/series" items={series} />
        <MediaRow title={t("arabicMovies")} href="/movies/arabic" items={arabicMovies} />
        <MediaRow title={t("arabicSeries")} href="/series/arabic" items={arabicSeries} />
        <MediaRow title={t("animeMovies")} href="/movies/anime" items={animeMovies} />
        <MediaRow title={t("animeSeries")} href="/series/anime" items={animeSeries} />
        <MediaRow title={t("ramadanSeries")} href="/series/ramadan" items={ramadan} />
        <MediaRow title={t("turkish")} href="/turkish" items={turkish} />
        <MediaRow title={t("asian")} href="/asian" items={asian} />
      </div>
    </>
  );
}
