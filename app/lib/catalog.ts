import type { DictKey } from "./i18n";

export type CatalogKind = "movie" | "tv";
export type CatalogGroup =
  | "franchises"
  | "foreign"
  | "english"
  | "spanish"
  | "french"
  | "asian"
  | "korean"
  | "anime"
  | "turkish"
  | "arabic"
  | "indian"
  | "dubbed"
  | "ramadan"
  | "ramadan2022"
  | "ramadan2023"
  | "ramadan2024"
  | "ramadan2025"
  | "ramadan2026";

export const MOVIE_GROUPS: { group: CatalogGroup; label: DictKey }[] = [
  { group: "franchises", label: "movieFranchises" },
  { group: "foreign", label: "foreignMovies" },
  { group: "english", label: "englishMovies" },
  { group: "spanish", label: "spanishMovies" },
  { group: "french", label: "frenchMovies" },
  { group: "asian", label: "asianMovies" },
  { group: "korean", label: "koreanMovies" },
  { group: "anime", label: "animeMovies" },
  { group: "turkish", label: "turkishMovies" },
  { group: "arabic", label: "arabicMovies" },
  { group: "indian", label: "indianMovies" },
];

export const SERIES_GROUPS: { group: CatalogGroup; label: DictKey }[] = [
  { group: "foreign", label: "foreignSeries" },
  { group: "english", label: "englishSeries" },
  { group: "spanish", label: "spanishSeries" },
  { group: "french", label: "frenchSeries" },
  { group: "asian", label: "asianSeries" },
  { group: "korean", label: "koreanSeries" },
  { group: "anime", label: "animeSeries" },
  { group: "turkish", label: "turkishSeries" },
  { group: "arabic", label: "arabicSeries" },
  { group: "dubbed", label: "dubbedSeries" },
  { group: "indian", label: "indianSeries" },
];

export const RAMADAN_GROUPS: { group: CatalogGroup; label: DictKey }[] = [
  { group: "ramadan", label: "ramadanSeries" },
  { group: "ramadan2026", label: "ramadan2026" },
  { group: "ramadan2025", label: "ramadan2025" },
  { group: "ramadan2024", label: "ramadan2024" },
  { group: "ramadan2023", label: "ramadan2023" },
  { group: "ramadan2022", label: "ramadan2022" },
];

export const BROWSE_COLS = 5;
export const BROWSE_ROWS = 9;
export const BROWSE_PAGE_SIZE = BROWSE_ROWS * BROWSE_COLS;

export function catalogHref(kind: CatalogKind, group: CatalogGroup): string {
  return kind === "movie" ? `/movies/${group}` : `/series/${group}`;
}

export function isMovieGroup(group: string): group is CatalogGroup {
  return MOVIE_GROUPS.some((item) => item.group === group);
}

export function isSeriesGroup(group: string): group is CatalogGroup {
  return SERIES_GROUPS.some((item) => item.group === group);
}

export function isRamadanGroup(group: string): group is CatalogGroup {
  return RAMADAN_GROUPS.some((item) => item.group === group);
}

export function isTvCatalogGroup(group: string): group is CatalogGroup {
  return isSeriesGroup(group) || isRamadanGroup(group);
}
