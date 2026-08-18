"use client";

import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import Hero from "./Hero";
import MediaRow from "./MediaRow";
import CatalogToolbar from "./CatalogToolbar";
import { SiteAdsterraRail } from "./ads/SiteAdsterraRail";

export default function HomeCatalog({
  trending,
  movies,
  series,
  foreignEpisodes,
  animeEpisodes,
  newAnime,
  topRatedAnime,
  hotAnimeWeek,
  anime18,
  arabicEpisodes,
  ramadan,
  dailyMovies,
  dailySeries,
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
  newAnime: MediaItem[];
  topRatedAnime: MediaItem[];
  hotAnimeWeek: MediaItem[];
  anime18: MediaItem[];
  arabicEpisodes: MediaItem[];
  ramadan: MediaItem[];
  dailyMovies: MediaItem[];
  dailySeries: MediaItem[];
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
        <MediaRow title={t("addedTodayMovies")} href="/movies" items={dailyMovies} />
        <MediaRow title={t("addedTodaySeries")} href="/series" items={dailySeries} />
        <MediaRow title={t("newForeignEpisodes")} href="/series/foreign" items={foreignEpisodes} />
        <SiteAdsterraRail variant="alt" className="mb-10" />
        <MediaRow title={t("topRatedAnime")} href="/series/anime" items={topRatedAnime} />
        <MediaRow title={t("hotAnimeWeek")} href="/series/anime" items={hotAnimeWeek} />
        <MediaRow title={t("anime18Rail")} href="/series/anime" items={anime18} />
        <MediaRow title={t("newAnimeTitles")} href="/series/anime" items={newAnime} />
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
