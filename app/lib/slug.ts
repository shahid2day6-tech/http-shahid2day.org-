import type { MediaItem, MediaType } from "./tmdb";

const MOVIE_PREFIX = "فيلم-";
const SERIES_PREFIX = "مسلسل-";
const SUBTITLED_SUFFIX = "-مترجم-اون-لاين";
const ONLINE_SUFFIX = "-اون-لاين";

export function slugifyTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function titleHref(
  item: Pick<MediaItem, "title" | "type" | "year" | "originalLanguage">
): string {
  const prefix = item.type === "tv" ? SERIES_PREFIX : MOVIE_PREFIX;
  const suffix =
    item.originalLanguage && item.originalLanguage !== "ar"
      ? SUBTITLED_SUFFIX
      : ONLINE_SUFFIX;
  const name = slugifyTitle(item.title);
  const year = /^\d{4}$/.test(item.year) ? item.year : "";
  const body = [name, year].filter(Boolean).join("-");
  return `/${prefix}${body}${suffix}`;
}

export type ParsedTitleSlug = {
  type: MediaType;
  titleSlug: string;
  query: string;
  year: string;
};

export function parseTitleSlug(raw: string): ParsedTitleSlug | null {
  const slug = decodeURIComponent(raw).replace(/^\/+|\/+$/g, "");
  let type: MediaType;
  let rest: string;
  if (slug.startsWith(MOVIE_PREFIX)) {
    type = "movie";
    rest = slug.slice(MOVIE_PREFIX.length);
  } else if (slug.startsWith(SERIES_PREFIX)) {
    type = "tv";
    rest = slug.slice(SERIES_PREFIX.length);
  } else {
    return null;
  }

  if (rest.endsWith(SUBTITLED_SUFFIX)) {
    rest = rest.slice(0, -SUBTITLED_SUFFIX.length);
  } else if (rest.endsWith(ONLINE_SUFFIX)) {
    rest = rest.slice(0, -ONLINE_SUFFIX.length);
  }

  const yearMatch = rest.match(/-(\d{4})$/);
  const year = yearMatch?.[1] ?? "";
  const titleSlug = (yearMatch ? rest.slice(0, -5) : rest).replace(/^-+|-+$/g, "");
  if (!titleSlug) return null;
  return {
    type,
    titleSlug,
    query: titleSlug.replace(/-/g, " "),
    year,
  };
}
