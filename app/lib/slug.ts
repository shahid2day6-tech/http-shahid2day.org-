import type { Lang } from "./i18n";
import type { MediaItem, MediaType } from "./tmdb";

const AR = {
  movie: "فيلم-",
  series: "مسلسل-",
  subtitled: "-مترجم-اون-لاين",
  online: "-اون-لاين",
} as const;

const EN = {
  movie: "movie-",
  series: "series-",
  subtitled: "-subtitled-online",
  online: "-online",
} as const;

function affixes(lang: Lang) {
  return lang === "en" ? EN : AR;
}

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
  item: Pick<MediaItem, "title" | "type" | "year" | "originalLanguage">,
  lang: Lang = "ar"
): string {
  const parts = affixes(lang);
  const prefix = item.type === "tv" ? parts.series : parts.movie;
  const suffix =
    item.originalLanguage && item.originalLanguage !== "ar"
      ? parts.subtitled
      : parts.online;
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
  slugLang: Lang;
  subtitled: boolean;
};

export function parseTitleSlug(raw: string): ParsedTitleSlug | null {
  let slug = raw;
  try {
    slug = decodeURIComponent(raw);
  } catch {
    /* keep raw */
  }
  slug = slug.replace(/^\/+|\/+$/g, "");

  let type: MediaType;
  let rest: string;
  let slugLang: Lang;
  if (slug.startsWith(AR.movie)) {
    type = "movie";
    rest = slug.slice(AR.movie.length);
    slugLang = "ar";
  } else if (slug.startsWith(AR.series)) {
    type = "tv";
    rest = slug.slice(AR.series.length);
    slugLang = "ar";
  } else if (slug.startsWith(EN.movie)) {
    type = "movie";
    rest = slug.slice(EN.movie.length);
    slugLang = "en";
  } else if (slug.startsWith(EN.series)) {
    type = "tv";
    rest = slug.slice(EN.series.length);
    slugLang = "en";
  } else {
    return null;
  }

  let subtitled = true;
  if (rest.endsWith(AR.subtitled)) {
    rest = rest.slice(0, -AR.subtitled.length);
    subtitled = true;
  } else if (rest.endsWith(EN.subtitled)) {
    rest = rest.slice(0, -EN.subtitled.length);
    subtitled = true;
  } else if (rest.endsWith(AR.online)) {
    rest = rest.slice(0, -AR.online.length);
    subtitled = false;
  } else if (rest.endsWith(EN.online)) {
    rest = rest.slice(0, -EN.online.length);
    subtitled = false;
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
    slugLang,
    subtitled,
  };
}

export function switchTitleSlugLang(path: string, lang: Lang): string | null {
  const parsed = parseTitleSlug(path);
  if (!parsed) return null;
  return titleHref(
    {
      title: parsed.query,
      type: parsed.type,
      year: parsed.year,
      originalLanguage: parsed.subtitled ? "en" : "ar",
    },
    lang
  );
}
