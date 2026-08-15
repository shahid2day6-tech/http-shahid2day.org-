import type { CatalogGroup, CatalogKind } from "./catalog";
import { MOVIE_GROUPS, RAMADAN_GROUPS, SERIES_GROUPS } from "./catalog";
import type { DictKey } from "./i18n";

export type CatalogSort =
  | "latest"
  | "rating"
  | "popular"
  | "trending"
  | "new-movies"
  | "new-episodes";

export type CatalogFilters = {
  sort?: CatalogSort;
  genre?: string;
  year?: string;
};

export const SORT_MODES: {
  id: CatalogSort;
  labelKey: DictKey;
  icon: string;
  tone: string;
}[] = [
  { id: "latest", labelKey: "sortLatest", icon: "◎", tone: "bg-[#1f8a8a]" },
  { id: "rating", labelKey: "sortRating", icon: "★", tone: "bg-[#c9a227]" },
  { id: "popular", labelKey: "sortPopular", icon: "🥇", tone: "bg-[#6b4aa0]" },
  { id: "trending", labelKey: "sortPinned", icon: "%", tone: "bg-[#b42318]" },
  { id: "new-movies", labelKey: "sortNewMovies", icon: "🎥", tone: "bg-[#c9a227]" },
  { id: "new-episodes", labelKey: "sortNewEpisodes", icon: "🎬", tone: "bg-[#d4b84a]" },
];

export const FILTER_SECTIONS: { id: string; labelKey: DictKey }[] = [
  { id: "all", labelKey: "filterAll" },
  ...MOVIE_GROUPS.map((item) => ({ id: `movie-${item.group}`, labelKey: item.label })),
  ...SERIES_GROUPS.map((item) => ({ id: `tv-${item.group}`, labelKey: item.label })),
  { id: "tv-ramadan", labelKey: "ramadanSeries" },
  ...RAMADAN_GROUPS.filter((item) => item.group !== "ramadan").map((item) => ({
    id: `tv-${item.group}`,
    labelKey: item.label,
  })),
];

export const FILTER_GENRES: { id: string; labelKey: DictKey; movieId?: number; tvId?: number }[] = [
  { id: "action", labelKey: "genreAction", movieId: 28, tvId: 10759 },
  { id: "adventure", labelKey: "genreAdventure", movieId: 12, tvId: 10759 },
  { id: "animation", labelKey: "genreAnimation", movieId: 16, tvId: 16 },
  { id: "comedy", labelKey: "genreComedy", movieId: 35, tvId: 35 },
  { id: "crime", labelKey: "genreCrime", movieId: 80, tvId: 80 },
  { id: "documentary", labelKey: "genreDocumentary", movieId: 99, tvId: 99 },
  { id: "drama", labelKey: "genreDrama", movieId: 18, tvId: 18 },
  { id: "family", labelKey: "genreFamily", movieId: 10751, tvId: 10751 },
  { id: "fantasy", labelKey: "genreFantasy", movieId: 14, tvId: 10765 },
  { id: "history", labelKey: "genreHistory", movieId: 36 },
  { id: "horror", labelKey: "genreHorror", movieId: 27 },
  { id: "music", labelKey: "genreMusic", movieId: 10402 },
  { id: "mystery", labelKey: "genreMystery", movieId: 9648, tvId: 9648 },
  { id: "reality", labelKey: "genreReality", tvId: 10764 },
  { id: "romance", labelKey: "genreRomance", movieId: 10749, tvId: 10749 },
  { id: "scifi", labelKey: "genreScifi", movieId: 878, tvId: 10765 },
  { id: "talk", labelKey: "genreTalk", tvId: 10767 },
  { id: "thriller", labelKey: "genreThriller", movieId: 53 },
  { id: "war", labelKey: "genreWar", movieId: 10752, tvId: 10768 },
  { id: "western", labelKey: "genreWestern", movieId: 37, tvId: 37 },
];

export const FILTER_YEARS: string[] = [
  "all",
  ...Array.from({ length: 2026 - 1979 }, (_, index) => String(2026 - index)),
];

export function parseSection(section?: string | null): { kind: CatalogKind; group: CatalogGroup } | null {
  if (!section || section === "all") return null;
  if (section.startsWith("movie-")) {
    return { kind: "movie", group: section.slice(6) as CatalogGroup };
  }
  if (section.startsWith("tv-")) {
    return { kind: "tv", group: section.slice(3) as CatalogGroup };
  }
  return null;
}

export function sectionFrom(kind?: CatalogKind, group?: CatalogGroup): string {
  if (kind && group) return `${kind}-${group}`;
  return "all";
}

export function isCatalogSort(value: string | null | undefined): value is CatalogSort {
  return SORT_MODES.some((item) => item.id === value);
}
