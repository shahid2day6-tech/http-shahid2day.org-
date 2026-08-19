"use client";

import type { MediaItem } from "../lib/tmdb";
import { useLang } from "../context/LanguageContext";
import Hero from "./Hero";
import MediaRow from "./MediaRow";
import CatalogToolbar from "./CatalogToolbar";
import { SiteAdsterraRail } from "./ads/SiteAdsterraRail";

function latestHeroItems(
  dailyMovies: MediaItem[],
  dailySeries: MediaItem[],
  newAnime: MediaItem[],
  trending: MediaItem[],
): MediaItem[] {
  const seen = new Set<string>();
  const out: MediaItem[] = [];
  const push = (item?: MediaItem) => {
    if (!item?.backdrop) return;
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  };
  const byYear = (a: MediaItem, b: MediaItem) => (b.year || "").localeCompare(a.year || "");
  const movies = dailyMovies.filter((item) => item.backdrop);
  const series = dailySeries.filter((item) => item.backdrop);
  const anime = newAnime.filter((item) => item.backdrop);
  [movies[0], series[0], anime[0]]
    .filter((item): item is MediaItem => Boolean(item))
    .sort(byYear)
    .forEach(push);
  movies.forEach(push);
  series.forEach(push);
  anime.forEach(push);
  trending.forEach(push);
  return out.slice(0, 6);
}

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
  koreanSeries,
  koreanMovies,
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
  koreanSeries: MediaItem[];
  koreanMovies: MediaItem[];
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
  const heroItems = latestHeroItems(dailyMovies, dailySeries, newAnime, trending);

  return (
    <>
      <Hero items={heroItems} />
      <div
        data-mv-ad-below-hero="1"
        dir="ltr"
        className="relative z-20 mx-auto flex max-w-7xl flex-col items-end gap-2 px-4 py-2 sm:px-6"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SiteAdsterraRail className="mb-4" />
        <SiteAdsterraRail variant="box" className="mb-6" />
        <CatalogToolbar />
        <MediaRow title={t("trending")} items={trending} />
        <MediaRow title={t("addedTodayMovies")} href="/movies" items={dailyMovies} />
        <MediaRow title={t("addedTodaySeries")} href="/series" items={dailySeries} />
        <MediaRow title={t("newForeignEpisodes")} href="/series/foreign" items={foreignEpisodes} />
        <SiteAdsterraRail variant="alt" className="mb-10" />
        <MediaRow title={t("topRatedAnime")} href="/series/anime" items={topRatedAnime} />
        <MediaRow title={t("hotAnimeWeek")} href="/series/anime" items={hotAnimeWeek} />
        <MediaRow title={t("anime18Rail")} href="/series/anime" items={anime18} />
        <MediaRow title={t("koreanSeriesRail")} href="/series/korean" items={koreanSeries} />
        <MediaRow title={t("koreanMoviesRail")} href="/movies/korean" items={koreanMovies} />
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
