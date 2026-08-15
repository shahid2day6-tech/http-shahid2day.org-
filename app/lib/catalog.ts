import type { DictKey } from "./i18n";

export type CatalogKind = "movie" | "tv";
export type CatalogGroup =
  | "foreign"
  | "asian"
  | "anime"
  | "turkish"
  | "arabic"
  | "indian"
  | "dubbed";

export const MOVIE_GROUPS: { group: CatalogGroup; label: DictKey }[] = [
  { group: "foreign", label: "foreignMovies" },
  { group: "asian", label: "asianMovies" },
  { group: "anime", label: "animeMovies" },
  { group: "turkish", label: "turkishMovies" },
  { group: "arabic", label: "arabicMovies" },
  { group: "indian", label: "indianMovies" },
];

export const SERIES_GROUPS: { group: CatalogGroup; label: DictKey }[] = [
  { group: "foreign", label: "foreignSeries" },
  { group: "asian", label: "asianSeries" },
  { group: "anime", label: "animeSeries" },
  { group: "turkish", label: "turkishSeries" },
  { group: "arabic", label: "arabicSeries" },
  { group: "dubbed", label: "dubbedSeries" },
  { group: "indian", label: "indianSeries" },
];

export const BROWSE_ROWS = 5;
export const BROWSE_COLS = 9;
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
