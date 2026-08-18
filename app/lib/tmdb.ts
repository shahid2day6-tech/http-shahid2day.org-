import type { CatalogGroup, CatalogKind } from "./catalog";
import { BROWSE_PAGE_SIZE } from "./catalog";
import { parseTitleSlug, slugifyTitle } from "./slug";
import { FILTER_GENRES, parseSection, type CatalogFilters, type CatalogSort } from "./filters";
import { WEEKLY_HOT_ANIME } from "./featuredAnime";
import { ADULT_ANIME } from "./adultAnime";
import { filterBlockedItems, isBlockedTitle } from "./blockedTitles";

const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv";

export type MediaItem = {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  rating: string;
  year: string;
  type: MediaType;
  overview: string;
  originalLanguage: string;
  genreIds?: number[];
  href?: string;
  isFranchise?: boolean;
  isAdult?: boolean;
};

export type CategoryKey =
  | "trending"
  | "movies"
  | "series"
  | "anime"
  | "arabic"
  | "turkish"
  | "asian";

export type TitleDetails = MediaItem & {
  genres: string[];
  runtime: string;
  trailer: string | null;
  cast: { name: string; character: string; photo: string | null }[];
  similar: MediaItem[];
  providers: { name: string; logo: string | null }[];
  seasons?: number;
  episodes?: number;
  network?: string;
  homepage?: string | null;
  seasonList?: {
    seasonNumber: number;
    name: string;
    episodeCount: number;
    poster: string | null;
    year: string | null;
  }[];
  seasonEpisodes?: {
    seasonNumber: number;
    name: string;
    episodes: {
      episodeNumber: number;
      name: string;
      overview: string;
      airDate: string;
      still: string | null;
    }[];
  }[];
};

export type TvSeasonEpisode = {
  episodeNumber: number;
  name: string;
  overview: string;
  still: string | null;
  runtime: number | null;
  voteAverage: number;
};

function key(): string {
  return process.env.TMDB_API_KEY ?? "";
}

export function posterUrl(path: string | null, size = "w500"): string | null {
  if (!path) return null;
  return `${IMG}/${size}${path}`;
}

export function backdropUrl(path: string | null, size = "w1280"): string | null {
  if (!path) return null;
  return `${IMG}/${size}${path}`;
}

function mapItem(
  item: Record<string, unknown>,
  fallback?: MediaType
): MediaItem {
  const mediaType =
    fallback ??
    (item.media_type === "tv" || item.name ? "tv" : "movie");
  const originalLanguage = String(item.original_language ?? "");
  const localized = String(item.title ?? item.name ?? "");
  const original = String(item.original_title ?? item.original_name ?? "");
  const title =
    originalLanguage && originalLanguage !== "ar" && original
      ? original
      : localized || original;
  return {
    id: Number(item.id),
    title,
    poster: posterUrl((item.poster_path as string | null) ?? null)
      ?? backdropUrl((item.backdrop_path as string | null) ?? null, "w780"),
    backdrop: backdropUrl((item.backdrop_path as string | null) ?? null),
    rating:
      typeof item.vote_average === "number" && item.vote_average > 0
        ? item.vote_average.toFixed(1)
        : "0",
    year: String(item.release_date ?? item.first_air_date ?? "").slice(0, 4),
    type: mediaType === "tv" ? "tv" : "movie",
    overview: String(item.overview ?? ""),
    originalLanguage,
    genreIds: Array.isArray(item.genre_ids)
      ? (item.genre_ids as unknown[]).map(Number).filter((id) => Number.isFinite(id))
      : [],
  };
}

export function listingTitle(item: Pick<MediaItem, "title" | "type" | "year" | "originalLanguage">): string {
  const kind = item.type === "tv" ? "مسلسل" : "فيلم";
  const status =
    item.originalLanguage && item.originalLanguage !== "ar" ? "مترجم اون لاين" : "اون لاين";
  return [kind, item.title, item.year, status].filter(Boolean).join(" ");
}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate: number | false = 3600
): Promise<T | null> {
  const apiKey = key();
  if (!apiKey) return null;
  const url = new URL(`${TMDB}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(
    url.toString(),
    revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate, tags: ["catalog", "tmdb"] } }
  );
  if (!res.ok) return null;
  return (await res.json()) as T;
}

function mergeListResponses(
  primary: ListResponse | null,
  extra: ListResponse | null
): ListResponse | null {
  if (!primary) return extra;
  if (!extra?.results?.length) return primary;
  const extras = new Map(extra.results.map((row) => [Number(row.id), row]));
  const results = (primary.results ?? []).map((row) => {
    const en = extras.get(Number(row.id));
    if (!en) return row;
    return {
      ...row,
      poster_path: row.poster_path || en.poster_path,
      backdrop_path: row.backdrop_path || en.backdrop_path,
      overview: pickText(row.overview as string, en.overview as string),
      original_title: row.original_title || en.original_title,
      original_name: row.original_name || en.original_name,
    };
  });
  return { ...primary, results };
}

async function discoverList(
  path: string,
  params: Record<string, string | number>
): Promise<ListResponse | null> {
  const lang = String(params.language ?? "");
  const primary = await tmdb<ListResponse>(path, params, false);
  if (!lang.startsWith("ar")) return primary;
  const english = await tmdb<ListResponse>(path, { ...params, language: "en-US" }, false);
  return mergeListResponses(primary, english);
}

type ListResponse = {
  results?: Record<string, unknown>[];
  page?: number;
  total_pages?: number;
  total_results?: number;
};

function pageRange(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

export async function listSitemapItems(
  path: string,
  params: Record<string, string | number>,
  pages = 8
): Promise<MediaItem[]> {
  const fallback: MediaType | undefined = path.includes("/tv")
    ? "tv"
    : path.includes("/movie")
      ? "movie"
      : undefined;
  const rows = await Promise.all(
    pageRange(pages).map((page) =>
      tmdb<ListResponse>(path, {
        ...params,
        page,
        include_adult: "false",
        language: "en-US",
      })
    )
  );
  return filterBlockedItems(
    rows.flatMap((data) =>
      (data?.results ?? [])
        .filter((row) => row.media_type !== "person")
        .map((row) => mapItem(row, fallback))
        .filter((item) => item.id > 0 && item.title)
    )
  );
}

export type DiscoverResult = {
  items: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
};

export const BROWSE_PRELOAD_PAGES = 8;

function pageCount(data: ListResponse | null): number {
  return Math.min(Math.max(Number(data?.total_pages ?? 1), 1), 500);
}

function resultCount(data: ListResponse | null, fallback = 0): number {
  return Number(data?.total_results ?? fallback);
}

function asResult(
  items: MediaItem[],
  page: number,
  totalPages: number,
  totalResults: number
): DiscoverResult {
  return { items, page, totalPages, totalResults };
}

function newestSort(kind: CatalogKind): Record<string, string> {
  if (kind === "movie") {
    return {
      sort_by: "primary_release_date.desc",
      "primary_release_date.gte": "1950-01-01",
      "primary_release_date.lte": "2026-12-31",
    };
  }
  return {
    sort_by: "first_air_date.desc",
    "first_air_date.gte": "1950-01-01",
    "first_air_date.lte": "2026-12-31",
  };
}

function newEpisodeWindow(): Record<string, string> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 75);
  return {
    sort_by: "first_air_date.desc",
    "air_date.gte": start.toISOString().slice(0, 10),
    "air_date.lte": end.toISOString().slice(0, 10),
  };
}

function constrainCatalogItems(items: MediaItem[], filters?: CatalogFilters): MediaItem[] {
  let out = items;
  if (filters?.year && /^\d{4}$/.test(filters.year)) {
    out = out.filter((item) => item.year === filters.year);
  }
  if (filters?.genre) {
    const genre = FILTER_GENRES.find((item) => item.id === filters.genre);
    const ids = [genre?.movieId, genre?.tvId].filter((id): id is number => Boolean(id));
    if (ids.length) {
      out = out.filter((item) => item.genreIds?.some((id) => ids.includes(id)));
    }
  }
  return out;
}

function applyCatalogFilters(
  kind: CatalogKind,
  params: Record<string, string | number>,
  filters?: CatalogFilters
) {
  const sort: CatalogSort = filters?.sort ?? "latest";
  const year = filters?.year && /^\d{4}$/.test(filters.year) ? filters.year : "";

  if (year) {
    params.sort_by =
      sort === "rating"
        ? "vote_average.desc"
        : sort === "popular"
          ? "popularity.desc"
          : kind === "movie"
            ? "primary_release_date.desc"
            : "first_air_date.desc";
    if (sort === "rating") params["vote_count.gte"] = 50;
    delete params["air_date.gte"];
    delete params["air_date.lte"];
    if (kind === "movie") {
      params.primary_release_year = year;
      params["primary_release_date.gte"] = `${year}-01-01`;
      params["primary_release_date.lte"] = `${year}-12-31`;
      delete params["first_air_date.gte"];
      delete params["first_air_date.lte"];
    } else {
      params.first_air_date_year = year;
      params["first_air_date.gte"] = `${year}-01-01`;
      params["first_air_date.lte"] = `${year}-12-31`;
      delete params["primary_release_date.gte"];
      delete params["primary_release_date.lte"];
    }
  } else if (sort === "latest") {
    Object.assign(params, newestSort(kind));
  } else if (sort === "rating") {
    params.sort_by = "vote_average.desc";
    params["vote_count.gte"] = 50;
    delete params["primary_release_date.gte"];
    delete params["primary_release_date.lte"];
    delete params["first_air_date.gte"];
    delete params["first_air_date.lte"];
    delete params["air_date.gte"];
    delete params["air_date.lte"];
  } else if (sort === "popular") {
    params.sort_by = "popularity.desc";
    delete params["primary_release_date.gte"];
    delete params["primary_release_date.lte"];
    delete params["first_air_date.gte"];
    delete params["first_air_date.lte"];
  } else if (sort === "new-movies" && kind === "movie") {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 150);
    params.sort_by = "primary_release_date.desc";
    params["primary_release_date.gte"] = start.toISOString().slice(0, 10);
    params["primary_release_date.lte"] = end.toISOString().slice(0, 10);
    delete params["first_air_date.gte"];
    delete params["first_air_date.lte"];
    delete params.primary_release_year;
  } else if (sort === "new-episodes" && kind === "tv") {
    Object.assign(params, newEpisodeWindow());
  }

  if (filters?.genre) {
    const genre = FILTER_GENRES.find((item) => item.id === filters.genre);
    const genreId = kind === "movie" ? genre?.movieId : genre?.tvId;
    if (genreId) {
      const existing = String(params.with_genres ?? "");
      if (!existing) params.with_genres = String(genreId);
      else if (!existing.split(",").includes(String(genreId))) {
        params.with_genres = `${existing},${genreId}`;
      }
    }
  }
}

export async function discover(
  category: CategoryKey,
  lang: string,
  page = 1,
  filters?: CatalogFilters
): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const common = { language, page, include_adult: "false" };

  if (category === "trending") {
    const data = await discoverList("/trending/all/day", { language, page });
    const items = (data?.results ?? [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => mapItem(item));
    return asResult(items, 1, pageCount(data), resultCount(data, items.length));
  }

  if (category === "movies") {
    const params: Record<string, string | number> = {
      ...common,
      ...newestSort("movie"),
    };
    applyCatalogFilters("movie", params, filters);
    const data = await discoverList("/discover/movie", params);
    const items = constrainCatalogItems(
      (data?.results ?? []).map((item) => mapItem(item, "movie")),
      filters
    );
    return asResult(items, page, pageCount(data), resultCount(data, items.length));
  }

  if (category === "series") {
    const params: Record<string, string | number> = {
      ...common,
      ...newestSort("tv"),
    };
    applyCatalogFilters("tv", params, filters);
    const data = await discoverList("/discover/tv", params);
    const items = constrainCatalogItems(
      (data?.results ?? []).map((item) => mapItem(item, "tv")),
      filters
    );
    return asResult(items, page, pageCount(data), resultCount(data, items.length));
  }

  if (category === "anime") {
    const tvParams: Record<string, string | number> = {
      ...common,
      with_genres: "16",
      with_origin_country: "JP",
      ...newestSort("tv"),
    };
    const movieParams: Record<string, string | number> = {
      ...common,
      with_genres: "16",
      with_original_language: "ja",
      ...newestSort("movie"),
    };
    applyCatalogFilters("tv", tvParams, filters);
    applyCatalogFilters("movie", movieParams, filters);
    const [tv, movies] = await Promise.all([
      discoverList("/discover/tv", tvParams),
      discoverList("/discover/movie", movieParams),
    ]);
    return asResult(
      mergeLists(
        constrainCatalogItems((tv?.results ?? []).map((item) => mapItem(item, "tv")), filters),
        constrainCatalogItems((movies?.results ?? []).map((item) => mapItem(item, "movie")), filters)
      ),
      page,
      Math.max(pageCount(tv), pageCount(movies)),
      resultCount(tv) + resultCount(movies)
    );
  }

  if (category === "arabic") {
    return discoverByLanguage("ar", language, page);
  }

  if (category === "turkish") {
    return discoverByLanguage("tr", language, page);
  }

  const [tv, movies] = await Promise.all([
    discoverList("/discover/tv", {
      ...common,
      with_origin_country: "JP|KR|CN|TH|IN|TW|HK",
      without_genres: "16",
      without_keywords: "210024",
      ...newestSort("tv"),
    }),
    discoverList("/discover/movie", {
      ...common,
      with_origin_country: "JP|KR|CN|TH|IN|TW|HK",
      without_genres: "16",
      without_keywords: "210024",
      ...newestSort("movie"),
    }),
  ]);
  return asResult(
    mergeLists(
      (tv?.results ?? []).map((item) => mapItem(item, "tv")),
      (movies?.results ?? []).map((item) => mapItem(item, "movie"))
    ),
    page,
    Math.max(pageCount(tv), pageCount(movies)),
    resultCount(tv) + resultCount(movies)
  );
}

export async function discoverCatalog(
  kind: CatalogKind,
  group: CatalogGroup,
  lang: string,
  page = 1,
  filters?: CatalogFilters
): Promise<DiscoverResult> {
  if (kind === "movie" && group === "franchises") {
    return discoverFranchises(lang, page);
  }
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const path = kind === "movie" ? "/discover/movie" : "/discover/tv";
  const fallback: MediaType = kind === "movie" ? "movie" : "tv";
  const common: Record<string, string | number> = {
    language,
    page,
    include_adult: "false",
    ...newestSort(kind),
  };

  if (group === "foreign") {
    common.with_origin_country = "US|GB|CA|AU|FR|DE|IT|ES";
  } else if (group === "asian") {
    common.with_origin_country = "JP|KR|CN|TH|TW|HK";
    common.without_genres = "16";
    common.without_keywords = "210024";
  } else if (group === "anime") {
    common.with_genres = "16";
    if (kind === "tv") {
      common.with_origin_country = "JP";
    } else {
      common.with_original_language = "ja";
    }
  } else if (group === "turkish") {
    common.with_original_language = "tr";
  } else if (group === "arabic") {
    common.with_original_language = "ar";
  } else if (group === "indian") {
    common.with_origin_country = "IN";
  } else if (group.startsWith("ramadan")) {
    const data = await discoverRamadan(group, lang, page);
    return asResult(
      constrainCatalogItems(data.items, filters),
      data.page,
      data.totalPages,
      data.totalResults
    );
  } else {
    common.with_original_language = "en";
  }

  applyCatalogFilters(kind, common, filters);
  const data = await discoverList(path, common);
  const items = constrainCatalogItems(
    (data?.results ?? []).map((item) => mapItem(item, fallback)),
    filters
  );
  return asResult(items, page, pageCount(data), resultCount(data, items.length));
}

export async function discoverNewEpisodes(
  group: "foreign" | "anime" | "arabic",
  lang: string,
  page = 1
): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const common: Record<string, string | number> = {
    language,
    page,
    include_adult: "false",
    ...newEpisodeWindow(),
  };
  if (group === "foreign") {
    common.with_origin_country = "US|GB|CA|AU|FR|DE|IT|ES";
  } else if (group === "anime") {
    common.with_genres = "16";
    common.with_origin_country = "JP";
  } else {
    common.with_original_language = "ar";
  }
  const data = await discoverList("/discover/tv", common);
  const items = (data?.results ?? []).map((item) => mapItem(item, "tv"));
  return asResult(items, page, pageCount(data), resultCount(data, items.length));
}

function dailyReleaseWindow(days: number) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return {
    gte: start.toISOString().slice(0, 10),
    lte: end.toISOString().slice(0, 10),
  };
}

export async function discoverDailyMovies(lang: string, page = 1): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const { gte, lte } = dailyReleaseWindow(3);
  const data = await discoverList("/discover/movie", {
    language,
    page,
    include_adult: "false",
    sort_by: "primary_release_date.desc",
    "primary_release_date.gte": gte,
    "primary_release_date.lte": lte,
    "vote_count.gte": 1,
  });
  const items = (data?.results ?? []).map((item) => mapItem(item, "movie"));
  return asResult(items, page, pageCount(data), resultCount(data, items.length));
}

export async function discoverDailySeries(lang: string, page = 1): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const { gte, lte } = dailyReleaseWindow(3);
  const data = await discoverList("/discover/tv", {
    language,
    page,
    include_adult: "false",
    sort_by: "first_air_date.desc",
    "first_air_date.gte": gte,
    "first_air_date.lte": lte,
    "vote_count.gte": 1,
  });
  const items = (data?.results ?? []).map((item) => mapItem(item, "tv"));
  return asResult(items, page, pageCount(data), resultCount(data, items.length));
}

export async function discoverCatalogMany(
  kind: CatalogKind,
  group: CatalogGroup,
  lang: string,
  startPage = 1,
  endPage = BROWSE_PRELOAD_PAGES
): Promise<DiscoverResult> {
  const last = Math.max(startPage, endPage);
  const pages = await Promise.all(
    Array.from({ length: last - startPage + 1 }, (_, i) =>
      discoverCatalog(kind, group, lang, startPage + i)
    )
  );
  const items = uniqueItems(pages.flatMap((p) => p.items));
  const first = pages[0];
  return asResult(items, last, first?.totalPages ?? 1, first?.totalResults ?? items.length);
}

const TMDB_PAGE_SIZE = 20;

export async function discoverBrowse(
  source:
    | { category: CategoryKey }
    | { kind: CatalogKind; group: CatalogGroup },
  lang: string,
  browsePage = 1,
  filters?: CatalogFilters
): Promise<DiscoverResult> {
  if ("kind" in source && source.kind === "movie" && source.group === "franchises") {
    return discoverFranchises(lang, browsePage);
  }
  const page = Math.max(1, browsePage);
  const start = (page - 1) * BROWSE_PAGE_SIZE;
  const tmdbStart = Math.floor(start / TMDB_PAGE_SIZE) + 1;
  const tmdbEnd = Math.ceil((start + BROWSE_PAGE_SIZE) / TMDB_PAGE_SIZE) + 1;
  const chunks = await Promise.all(
    Array.from({ length: tmdbEnd - tmdbStart + 1 }, (_, i) => {
      const tmdbPage = tmdbStart + i;
      return "kind" in source
        ? discoverCatalog(source.kind, source.group, lang, tmdbPage, filters)
        : discover(source.category, lang, tmdbPage, filters);
    })
  );
  const combined = constrainCatalogItems(
    uniqueItems(chunks.flatMap((chunk) => chunk.items)),
    filters
  );
  const skip = start % TMDB_PAGE_SIZE;
  const items = combined.slice(skip, skip + BROWSE_PAGE_SIZE);
  const totalResults = chunks[0]?.totalResults ?? items.length;
  const totalPages = Math.max(1, Math.min(500, Math.ceil(totalResults / BROWSE_PAGE_SIZE)));
  return asResult(items, page, totalPages, totalResults);
}

export async function discoverFiltered(
  lang: string,
  page: number,
  opts: { section?: string; sort?: CatalogSort; genre?: string; year?: string }
): Promise<DiscoverResult> {
  const sort: CatalogSort = opts.sort ?? "latest";
  const year = opts.year && /^\d{4}$/.test(opts.year) ? opts.year : undefined;
  const genre = opts.genre || undefined;
  const section = parseSection(opts.section);
  const ranking: CatalogSort =
    year && (sort === "new-movies" || sort === "new-episodes") ? "latest" : sort;
  const filters: CatalogFilters = { sort: ranking, genre, year };

  if (sort === "trending-anime") {
    return discoverBrowse({ category: "anime" }, lang, page, {
      sort: "popular",
      genre,
      year,
    });
  }
  if (ranking === "new-episodes" && !year) {
    if (section?.kind === "tv") {
      return discoverBrowse({ kind: "tv", group: section.group }, lang, page, filters);
    }
    return discoverBrowse({ category: "series" }, lang, page, filters);
  }
  if (ranking === "new-movies" && !year) {
    if (section?.kind === "movie") {
      return discoverBrowse({ kind: "movie", group: section.group }, lang, page, filters);
    }
    return discoverBrowse({ category: "movies" }, lang, page, filters);
  }
  if (section) {
    return discoverBrowse({ kind: section.kind, group: section.group }, lang, page, filters);
  }
  if (ranking === "new-episodes") {
    return discoverBrowse({ category: "series" }, lang, page, filters);
  }
  return discoverBrowse({ category: "movies" }, lang, page, filters);
}

export async function discoverMany(
  category: CategoryKey,
  lang: string,
  startPage = 1,
  endPage = BROWSE_PRELOAD_PAGES
): Promise<DiscoverResult> {
  const last = Math.max(startPage, endPage);
  const pages = await Promise.all(
    Array.from({ length: last - startPage + 1 }, (_, i) =>
      discover(category, lang, startPage + i)
    )
  );
  const items = uniqueItems(pages.flatMap((p) => p.items));
  const first = pages[0];
  return asResult(
    items,
    last,
    first?.totalPages ?? 1,
    first?.totalResults ?? items.length
  );
}

async function discoverByLanguage(
  original: string,
  language: string,
  page: number
): Promise<DiscoverResult> {
  const base = {
    language,
    page,
    include_adult: "false",
    with_original_language: original,
  };
  const [tv, movies] = await Promise.all([
    discoverList("/discover/tv", { ...base, ...newestSort("tv") }),
    discoverList("/discover/movie", { ...base, ...newestSort("movie") }),
  ]);
  return asResult(
    mergeLists(
      (tv?.results ?? []).map((item) => mapItem(item, "tv")),
      (movies?.results ?? []).map((item) => mapItem(item, "movie"))
    ),
    page,
    Math.max(pageCount(tv), pageCount(movies)),
    resultCount(tv) + resultCount(movies)
  );
}

function uniqueItems(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = item.href ?? `${item.type}-${item.id}`;
    if (seen.has(k) || !item.poster || isBlockedTitle(item.type, item.id)) return false;
    seen.add(k);
    return true;
  });
}

function mergeLists(a: MediaItem[], b: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  const out: MediaItem[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    for (const item of [a[i], b[i]]) {
      if (!item?.poster) continue;
      const k = `${item.type}-${item.id}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

const FRANCHISE_QUERIES = [
  "marvel",
  "star wars",
  "harry potter",
  "fast furious",
  "mission impossible",
  "john wick",
  "james bond",
  "jurassic",
  "spider-man",
  "batman",
  "avengers",
  "x-men",
  "terminator",
  "alien",
  "matrix",
  "toy story",
  "pirates of the caribbean",
  "hunger games",
  "transformers",
  "conjuring",
  "halloween",
  "saw",
  "dune",
  "indiana jones",
  "despicable me",
  "shrek",
  "frozen",
  "godfather",
  "superman",
  "deadpool",
  "venom",
  "iron man",
  "thor",
  "captain america",
  "guardians of the galaxy",
  "black panther",
  "planet of the apes",
  "rocky",
  "rambo",
  "die hard",
  "bourne",
  "equalizer",
  "ip man",
  "kung fu panda",
  "how to train your dragon",
  "ice age",
  "cars",
  "incredibles",
  "jumanji",
  "ghostbusters",
  "scream",
  "insidious",
  "resident evil",
  "twilight",
  "hobbit",
  "lord of the rings",
  "star trek",
  "men in black",
  "sonic",
  "super mario",
  "baahubali",
  "dhoom",
  "recep ivedik",
  "ولاد رزق",
  "اللمبي",
];

function franchiseTitle(name: string): string {
  return name
    .replace(/\s*collection$/i, "")
    .replace(/\s*سلسلة\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapCollectionHit(row: Record<string, unknown>): MediaItem | null {
  const id = Number(row.id);
  const poster = posterUrl((row.poster_path as string | null) ?? null);
  if (!id || !poster) return null;
  return {
    id,
    title: franchiseTitle(String(row.name ?? "")),
    poster,
    backdrop: backdropUrl((row.backdrop_path as string | null) ?? null),
    rating: "0",
    year: "",
    type: "movie",
    overview: String(row.overview ?? ""),
    originalLanguage: "ar",
    href: `/movies/franchises/${id}`,
    isFranchise: true,
  };
}

async function listFranchises(lang: string): Promise<MediaItem[]> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const pages = await Promise.all(
    FRANCHISE_QUERIES.map((query) =>
      tmdb<ListResponse>("/search/collection", {
        query,
        language,
        include_adult: "false",
        page: 1,
      })
    )
  );
  return uniqueItems(
    pages.flatMap((page) => (page?.results ?? []).map((row) => mapCollectionHit(row)).filter((item): item is MediaItem => Boolean(item)))
  );
}

export async function discoverFranchises(lang: string, browsePage = 1): Promise<DiscoverResult> {
  const all = await listFranchises(lang);
  const page = Math.max(1, browsePage);
  const start = (page - 1) * BROWSE_PAGE_SIZE;
  const items = all.slice(start, start + BROWSE_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(all.length / BROWSE_PAGE_SIZE));
  return asResult(items, page, totalPages, all.length);
}

export async function getFranchise(
  id: number,
  lang: string
): Promise<{ id: number; title: string; overview: string; poster: string | null; items: MediaItem[] } | null> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const [primary, english] = await Promise.all([
    tmdb<Record<string, unknown>>(`/collection/${id}`, { language }),
    language.startsWith("ar")
      ? tmdb<Record<string, unknown>>(`/collection/${id}`, { language: "en-US" })
      : Promise.resolve(null),
  ]);
  const data = primary ?? english;
  if (!data) return null;
  const parts = uniqueItems(
    ((data.parts as Record<string, unknown>[] | undefined) ?? [])
      .map((row) => mapItem(row, "movie"))
      .sort((a, b) => a.year.localeCompare(b.year))
  );
  return {
    id: Number(data.id),
    title: franchiseTitle(String(data.name ?? english?.name ?? "")),
    overview: String(data.overview || english?.overview || ""),
    poster: posterUrl((data.poster_path as string | null) ?? (english?.poster_path as string | null) ?? null),
    items: parts,
  };
}

export async function getTitleBySlug(
  slug: string,
  lang: string
): Promise<TitleDetails | null> {
  const parsed = parseTitleSlug(slug);
  if (!parsed) return null;
  const path = parsed.type === "movie" ? "/search/movie" : "/search/tv";
  const base: Record<string, string | number> = {
    query: parsed.query,
    language: "en-US",
    include_adult: "false",
    page: 1,
  };
  const withYear: Record<string, string | number> = { ...base };
  if (parsed.year) {
    if (parsed.type === "movie") withYear.year = parsed.year;
    else withYear.first_air_date_year = parsed.year;
  }
  const first = await tmdb<ListResponse>(path, withYear);
  let rows = first?.results ?? [];
  if (!rows.length && parsed.year) {
    const second = await tmdb<ListResponse>(path, base);
    rows = second?.results ?? [];
  }
  const items = rows.map((row) => mapItem(row, parsed.type));
  const needle = parsed.titleSlug;
  const ranked = items
    .map((item) => {
      const slugTitle = slugifyTitle(item.title);
      let score = 0;
      if (slugTitle === needle) score += 8;
      else if (slugTitle.startsWith(needle) || needle.startsWith(slugTitle)) score += 4;
      else if (slugTitle.includes(needle) || needle.includes(slugTitle)) score += 2;
      if (parsed.year && item.year === parsed.year) score += 5;
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);
  const match = ranked[0]?.item ?? items[0];
  if (!match) return null;
  return getTitle(match.type, match.id, lang);
}

export async function searchMedia(query: string, lang: string): Promise<MediaItem[]> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const pages = await Promise.all(
    [1, 2, 3].map((page) =>
      tmdb<ListResponse>("/search/multi", {
        language,
        query,
        include_adult: "false",
        page: String(page),
      })
    )
  );
  const seen = new Set<string>();
  return pages
    .flatMap((data) => data?.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => mapItem(item))
    .filter((item) => {
      const key = `${item.type}-${item.id}`;
      if (seen.has(key) || isBlockedTitle(item.type, item.id)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Number(Boolean(b.poster)) - Number(Boolean(a.poster)));
}

function pickText(...values: (string | null | undefined)[]): string {
  return values.find((value) => value && value.trim()) ?? "";
}

function translationText(
  data: Record<string, unknown> | null,
  iso: string
): { name: string; overview: string } {
  const rows =
    (
      data?.translations as {
        translations?: { iso_639_1?: string; data?: { name?: string; title?: string; overview?: string } }[];
      }
    )?.translations ?? [];
  const row = rows.find((item) => item.iso_639_1 === iso)?.data;
  return {
    name: pickText(row?.name, row?.title),
    overview: pickText(row?.overview),
  };
}

function trailerKey(data: Record<string, unknown> | null): string | null {
  const videos =
    (data?.videos as { results?: { type: string; site: string; key: string }[] })?.results ?? [];
  return (
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer")?.key ??
    videos.find((video) => video.site === "YouTube")?.key ??
    null
  );
}

function mapCast(people: Record<string, unknown>[]): TitleDetails["cast"] {
  return people
    .map((person, index) => {
      const roles = person.roles as { character?: string }[] | undefined;
      return {
        name: pickText(person.name as string, person.original_name as string),
        character: pickText(person.character as string, roles?.[0]?.character),
        photo: posterUrl((person.profile_path as string | null) ?? null, "w500"),
        order: Number(person.order ?? index),
      };
    })
    .filter((person) => person.name)
    .sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)) || a.order - b.order)
    .slice(0, 16)
    .map(({ name, character, photo }) => ({ name, character, photo }));
}

function providerList(data: Record<string, unknown> | null): TitleDetails["providers"] {
  const providerRoot = data?.["watch/providers"] as {
    results?: Record<string, { flatrate?: { provider_name: string; logo_path: string | null }[] }>;
  };
  const region =
    providerRoot?.results?.SA ??
    providerRoot?.results?.AE ??
    providerRoot?.results?.EG ??
    providerRoot?.results?.US;
  return (region?.flatrate ?? []).slice(0, 6).map((provider) => ({
    name: provider.provider_name,
    logo: posterUrl(provider.logo_path, "w92"),
  }));
}

function mapSeasonList(
  primary: Record<string, unknown>,
  fallback?: Record<string, unknown> | null
): NonNullable<TitleDetails["seasonList"]> {
  const rows =
    (primary.seasons as
      | {
          season_number?: number;
          name?: string;
          episode_count?: number;
          poster_path?: string | null;
          air_date?: string;
        }[]
      | undefined) ??
    (fallback?.seasons as
      | {
          season_number?: number;
          name?: string;
          episode_count?: number;
          poster_path?: string | null;
          air_date?: string;
        }[]
      | undefined) ??
    [];
  return rows
    .filter((season) => Number(season.season_number) > 0)
    .map((season) => ({
      seasonNumber: Number(season.season_number),
      name: season.name || "",
      episodeCount: Number(season.episode_count ?? 0),
      poster: posterUrl(season.poster_path ?? null, "w300"),
      year: String(season.air_date ?? "").slice(0, 4) || null,
    }));
}

export async function getTvSeason(
  tvId: number,
  season: number,
  lang: string
): Promise<{ seasonNumber: number; episodes: TvSeasonEpisode[] } | null> {
  if (isBlockedTitle("tv", tvId)) return null;
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const [primary, fallback] = await Promise.all([
    tmdb<{
      season_number?: number;
      episodes?: Record<string, unknown>[];
    }>(`/tv/${tvId}/season/${season}`, { language }),
    language === "ar-SA"
      ? tmdb<{ episodes?: Record<string, unknown>[] }>(`/tv/${tvId}/season/${season}`, {
          language: "en-US",
        })
      : Promise.resolve(null),
  ]);
  if (!primary) return null;
  const enByNumber = new Map<number, Record<string, unknown>>(
    (fallback?.episodes ?? []).map((episode) => [
      Number(episode.episode_number ?? 0),
      episode,
    ])
  );
  return {
    seasonNumber: Number(primary.season_number ?? season),
    episodes: (primary.episodes ?? []).map((episode, index) => {
      const number = Number(episode.episode_number ?? index + 1);
      const enEp = enByNumber.get(number);
      return {
        episodeNumber: number,
        name: pickText(episode.name as string, enEp?.name as string) || `الحلقة ${number}`,
        overview: pickText(episode.overview as string, enEp?.overview as string),
        still: posterUrl(
          ((episode.still_path as string | null) ?? (enEp?.still_path as string | null) ?? null),
          "w300"
        ),
        runtime: Number(episode.runtime ?? enEp?.runtime ?? 0) || null,
        voteAverage: Number(episode.vote_average ?? 0),
      };
    }),
  };
}

async function discoverRamadan(
  group: CatalogGroup,
  lang: string,
  page: number
): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const year = group === "ramadan" ? 0 : Number(group.replace("ramadan", ""));
  const window = year
    ? { "first_air_date.gte": `${year}-02-01`, "first_air_date.lte": `${year}-05-31` }
    : { "first_air_date.gte": "2022-02-01", "first_air_date.lte": "2026-05-31" };
  const search: Record<string, string | number> = {
    query: year ? `رمضان ${year}` : "رمضان",
    language,
    page,
    include_adult: "false",
  };
  if (year) search.first_air_date_year = year;

  const [named, tagged, seasonal] = await Promise.all([
    tmdb<ListResponse>("/search/tv", search),
    discoverList("/discover/tv", {
      language,
      page,
      include_adult: "false",
      sort_by: "popularity.desc",
      with_original_language: "ar",
      with_keywords: "297545",
      ...window,
    }),
    discoverList("/discover/tv", {
      language,
      page,
      include_adult: "false",
      sort_by: "popularity.desc",
      with_original_language: "ar",
      with_origin_country: "EG|SA|AE|SY|LB|JO|IQ|KW|QA|BH|OM|TN|MA|DZ",
      ...window,
    }),
  ]);

  const items = uniqueItems(
    [...(named?.results ?? []), ...(tagged?.results ?? []), ...(seasonal?.results ?? [])]
      .filter((item) => item.original_language === "ar" || !item.original_language)
      .map((item) => mapItem(item, "tv"))
  );
  return asResult(
    items,
    page,
    Math.max(pageCount(named), pageCount(tagged), pageCount(seasonal)),
    Math.max(resultCount(named), resultCount(tagged), resultCount(seasonal), items.length)
  );
}

export async function getTitle(
  type: MediaType,
  id: number,
  lang: string
): Promise<TitleDetails | null> {
  if (isBlockedTitle(type, id)) return null;
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const extras =
    type === "tv"
      ? "videos,credits,aggregate_credits,similar,recommendations,watch/providers,translations"
      : "videos,credits,similar,recommendations,watch/providers,translations";
  const [primary, fallback] = await Promise.all([
    tmdb<Record<string, unknown>>(`/${type}/${id}`, {
      language,
      append_to_response: extras,
    }),
    language === "ar-SA"
      ? tmdb<Record<string, unknown>>(`/${type}/${id}`, {
          language: "en-US",
          append_to_response: extras,
        })
      : Promise.resolve(null),
  ]);
  if (!primary) return null;

  const arText = translationText(primary, "ar");
  const enText = translationText(primary, "en");
  const originalLanguage = String(primary.original_language ?? "");
  const arabicName = pickText(primary.title as string, primary.name as string, arText.name);
  const englishName = pickText(
    fallback ? pickText(fallback.title as string, fallback.name as string) : "",
    enText.name,
    primary.original_title as string,
    primary.original_name as string
  );
  const displayName =
    originalLanguage === "ar"
      ? pickText(arabicName, englishName)
      : pickText(englishName, arabicName);
  const overview = pickText(
    primary.overview as string,
    arText.overview,
    fallback?.overview as string,
    enText.overview
  );
  const item = mapItem(
    {
      ...primary,
      title: displayName,
      name: displayName,
      original_title: displayName,
      original_name: displayName,
      overview,
      poster_path: primary.poster_path || fallback?.poster_path,
      backdrop_path: primary.backdrop_path || fallback?.backdrop_path,
    },
    type
  );

  const genres = ((primary.genres as { name: string }[]) ?? [])
    .map((genre) => genre.name)
    .filter(Boolean);
  if (!genres.length) {
    genres.push(
      ...((fallback?.genres as { name: string }[]) ?? []).map((genre) => genre.name).filter(Boolean)
    );
  }

  const lastEpisode = primary.last_episode_to_air as { runtime?: number } | undefined;
  const runtimeMinutes =
    type === "movie"
      ? Number(primary.runtime ?? fallback?.runtime ?? 0)
      : Number(
          (primary.episode_run_time as number[] | undefined)?.[0] ??
            lastEpisode?.runtime ??
            (fallback?.episode_run_time as number[] | undefined)?.[0] ??
            0
        );

  const aggregate = (
    primary.aggregate_credits as { cast?: Record<string, unknown>[] } | undefined
  )?.cast;
  const credits = (primary.credits as { cast?: Record<string, unknown>[] } | undefined)?.cast;
  const fallbackCast =
    (fallback?.aggregate_credits as { cast?: Record<string, unknown>[] } | undefined)?.cast ??
    (fallback?.credits as { cast?: Record<string, unknown>[] } | undefined)?.cast;
  const cast = mapCast(aggregate?.length ? aggregate : credits?.length ? credits : fallbackCast ?? []);

  const similar = uniqueItems(
    [
      ...((primary.similar as ListResponse)?.results ?? []),
      ...((primary.recommendations as ListResponse)?.results ?? []),
      ...((fallback?.similar as ListResponse)?.results ?? []),
      ...((fallback?.recommendations as ListResponse)?.results ?? []),
    ]
      .map((row) => mapItem(row, type))
      .filter((row) => row.id !== id)
  ).slice(0, 16);

  const providers = providerList(primary);
  if (!providers.length) providers.push(...providerList(fallback));

  const networks = ((primary.networks as { name?: string }[]) ?? [])
    .map((network) => network.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");

  return {
    ...item,
    genres,
    runtime: runtimeMinutes ? `${runtimeMinutes} د` : "",
    trailer: trailerKey(primary) ?? trailerKey(fallback),
    cast,
    similar,
    providers,
    seasons: type === "tv" ? Number(primary.number_of_seasons ?? 0) || undefined : undefined,
    episodes: type === "tv" ? Number(primary.number_of_episodes ?? 0) || undefined : undefined,
    network: networks || undefined,
    homepage: (primary.homepage as string | null) ?? (fallback?.homepage as string | null) ?? null,
    seasonList: type === "tv" ? mapSeasonList(primary, fallback) : [],
    seasonEpisodes: [],
  };
}

async function fetchFeaturedTitle(
  type: "movie" | "tv",
  id: number,
  lang: string
): Promise<MediaItem | null> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const data = await tmdb<Record<string, unknown>>(`/${type}/${id}`, { language });
  if (!data || !Number(data.id)) return null;
  const item = mapItem(data, type);
  return item.poster ? item : null;
}

export async function listAdultAnime(lang: string): Promise<MediaItem[]> {
  const rows = await Promise.all(ADULT_ANIME.map((item) => fetchFeaturedTitle(item.type, item.id, lang)));
  return uniqueItems(rows.filter((item): item is MediaItem => Boolean(item))).map((item) => ({
    ...item,
    isAdult: true,
  }));
}

export async function homeCatalog(lang: string) {
  const rail = async (load: (page: number) => Promise<DiscoverResult>) => {
    const [a, b] = await Promise.all([load(1), load(2)]);
    return asResult(uniqueItems([...a.items, ...b.items]), 2, Math.max(a.totalPages, b.totalPages), a.totalResults);
  };
  const [
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
    weeklyHotAnime,
    adult18Rows,
    dailyMovies,
    dailySeries,
  ] = await Promise.all([
    discoverMany("trending", lang, 1, 2),
    discoverMany("movies", lang, 1, 2),
    discoverMany("series", lang, 1, 2),
    rail((page) => discoverNewEpisodes("foreign", lang, page)),
    rail((page) => discoverNewEpisodes("anime", lang, page)),
    rail((page) => discoverNewEpisodes("arabic", lang, page)),
    discoverCatalogMany("tv", "ramadan", lang, 1, 2),
    discoverCatalogMany("movie", "anime", lang, 1, 2),
    discoverCatalogMany("tv", "anime", lang, 1, 2),
    discoverCatalogMany("movie", "arabic", lang, 1, 2),
    discoverCatalogMany("tv", "arabic", lang, 1, 2),
    discoverMany("turkish", lang, 1, 2),
    discoverMany("asian", lang, 1, 2),
    discoverFranchises(lang, 1),
    Promise.all(WEEKLY_HOT_ANIME.map((item) => fetchFeaturedTitle(item.type, item.id, lang))),
    Promise.all(ADULT_ANIME.map((item) => fetchFeaturedTitle(item.type, item.id, lang))),
    rail((page) => discoverDailyMovies(lang, page)),
    rail((page) => discoverDailySeries(lang, page)),
  ]);
  const row = (result: DiscoverResult) => uniqueItems(result.items).slice(0, 28);
  const hotAnimeWeek = uniqueItems(
    weeklyHotAnime.filter((item): item is MediaItem => Boolean(item))
  );
  const newAnime = uniqueItems(row(animeSeries)).slice(0, 28);
  const anime18 = uniqueItems(
    adult18Rows.filter((item): item is MediaItem => Boolean(item))
  ).map((item) => ({ ...item, isAdult: true }));
  return {
    trending: row(trending),
    movies: row(movies),
    series: row(series),
    foreignEpisodes: row(foreignEpisodes),
    animeEpisodes: row(animeEpisodes),
    hotAnimeWeek,
    newAnime,
    anime18,
    arabicEpisodes: row(arabicEpisodes),
    ramadan: row(ramadan),
    dailyMovies: row(dailyMovies),
    dailySeries: row(dailySeries),
    animeMovies: row(animeMovies),
    animeSeries: row(animeSeries),
    arabicMovies: row(arabicMovies),
    arabicSeries: row(arabicSeries),
    turkish: row(turkish),
    asian: row(asian),
    franchises: row(franchises),
  };
}
