import type { CatalogGroup, CatalogKind } from "./catalog";
import { BROWSE_PAGE_SIZE } from "./catalog";

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
  return {
    id: Number(item.id),
    title: String(item.title ?? item.name ?? ""),
    poster: posterUrl((item.poster_path as string | null) ?? null),
    backdrop: backdropUrl((item.backdrop_path as string | null) ?? null),
    rating:
      typeof item.vote_average === "number" && item.vote_average > 0
        ? item.vote_average.toFixed(1)
        : "0",
    year: String(item.release_date ?? item.first_air_date ?? "").slice(0, 4),
    type: mediaType === "tv" ? "tv" : "movie",
    overview: String(item.overview ?? ""),
  };
}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = 3600
): Promise<T | null> {
  const apiKey = key();
  if (!apiKey) return null;
  const url = new URL(`${TMDB}${path}`);
  url.searchParams.set("api_key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString(), {
    next: { revalidate },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

type ListResponse = {
  results?: Record<string, unknown>[];
  page?: number;
  total_pages?: number;
  total_results?: number;
};

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

export async function discover(
  category: CategoryKey,
  lang: string,
  page = 1
): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const common = { language, page, include_adult: "false" };

  if (category === "trending") {
    const data = await tmdb<ListResponse>("/trending/all/day", { language });
    const items = (data?.results ?? [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => mapItem(item));
    return asResult(items, 1, pageCount(data), resultCount(data, items.length));
  }

  if (category === "movies") {
    const data = await tmdb<ListResponse>("/discover/movie", {
      ...common,
      sort_by: "popularity.desc",
    });
    const items = (data?.results ?? []).map((item) => mapItem(item, "movie"));
    return asResult(items, page, pageCount(data), resultCount(data, items.length));
  }

  if (category === "series") {
    const data = await tmdb<ListResponse>("/discover/tv", {
      ...common,
      sort_by: "popularity.desc",
    });
    const items = (data?.results ?? []).map((item) => mapItem(item, "tv"));
    return asResult(items, page, pageCount(data), resultCount(data, items.length));
  }

  if (category === "anime") {
    const [tv, movies] = await Promise.all([
      tmdb<ListResponse>("/discover/tv", {
        ...common,
        with_genres: "16",
        with_origin_country: "JP",
        with_keywords: "210024",
        sort_by: "popularity.desc",
      }),
      tmdb<ListResponse>("/discover/movie", {
        ...common,
        with_genres: "16",
        with_original_language: "ja",
        sort_by: "popularity.desc",
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

  if (category === "arabic") {
    return discoverByLanguage("ar", language, page);
  }

  if (category === "turkish") {
    return discoverByLanguage("tr", language, page);
  }

  const [tv, movies] = await Promise.all([
    tmdb<ListResponse>("/discover/tv", {
      ...common,
      with_origin_country: "JP|KR|CN|TH|IN|TW|HK",
      without_genres: "16",
      without_keywords: "210024",
      sort_by: "popularity.desc",
    }),
    tmdb<ListResponse>("/discover/movie", {
      ...common,
      with_origin_country: "JP|KR|CN|TH|IN|TW|HK",
      without_genres: "16",
      without_keywords: "210024",
      sort_by: "popularity.desc",
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
  page = 1
): Promise<DiscoverResult> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const path = kind === "movie" ? "/discover/movie" : "/discover/tv";
  const fallback: MediaType = kind === "movie" ? "movie" : "tv";
  const common: Record<string, string | number> = {
    language,
    page,
    include_adult: "false",
    sort_by: "popularity.desc",
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
      common.with_keywords = "210024";
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
    return discoverRamadan(group, lang, page);
  } else {
    common.with_original_language = "en";
  }

  const data = await tmdb<ListResponse>(path, common);
  const items = (data?.results ?? []).map((item) => mapItem(item, fallback));
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
  browsePage = 1
): Promise<DiscoverResult> {
  const page = Math.max(1, browsePage);
  const start = (page - 1) * BROWSE_PAGE_SIZE;
  const tmdbStart = Math.floor(start / TMDB_PAGE_SIZE) + 1;
  const tmdbEnd = Math.ceil((start + BROWSE_PAGE_SIZE) / TMDB_PAGE_SIZE) + 1;
  const chunks = await Promise.all(
    Array.from({ length: tmdbEnd - tmdbStart + 1 }, (_, i) => {
      const tmdbPage = tmdbStart + i;
      return "kind" in source
        ? discoverCatalog(source.kind, source.group, lang, tmdbPage)
        : discover(source.category, lang, tmdbPage);
    })
  );
  const combined = uniqueItems(chunks.flatMap((chunk) => chunk.items));
  const skip = start % TMDB_PAGE_SIZE;
  const items = combined.slice(skip, skip + BROWSE_PAGE_SIZE);
  const totalResults = chunks[0]?.totalResults ?? items.length;
  const totalPages = Math.max(1, Math.min(500, Math.ceil(totalResults / BROWSE_PAGE_SIZE)));
  return asResult(items, page, totalPages, totalResults);
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
  const common = {
    language,
    page,
    include_adult: "false",
    with_original_language: original,
    sort_by: "popularity.desc",
  };
  const [tv, movies] = await Promise.all([
    tmdb<ListResponse>("/discover/tv", common),
    tmdb<ListResponse>("/discover/movie", common),
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
    const k = `${item.type}-${item.id}`;
    if (seen.has(k) || !item.poster) return false;
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

export async function searchMedia(query: string, lang: string): Promise<MediaItem[]> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const data = await tmdb<ListResponse>("/search/multi", {
    language,
    query,
    include_adult: "false",
    page: 1,
  });
  return (data?.results ?? [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => mapItem(item));
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
        photo: posterUrl((person.profile_path as string | null) ?? null, "w185"),
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
    tmdb<ListResponse>("/discover/tv", {
      language,
      page,
      include_adult: "false",
      sort_by: "popularity.desc",
      with_original_language: "ar",
      with_keywords: "297545",
      ...window,
    }),
    tmdb<ListResponse>("/discover/tv", {
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
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const extras =
    type === "tv"
      ? "videos,credits,aggregate_credits,similar,watch/providers,translations"
      : "videos,credits,similar,watch/providers,translations";
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
  const titleName = pickText(
    language.startsWith("ar")
      ? pickText(primary.title as string, primary.name as string, arText.name)
      : pickText(primary.title as string, primary.name as string),
    fallback ? pickText(fallback.title as string, fallback.name as string) : "",
    enText.name
  );
  const overview = pickText(
    primary.overview as string,
    arText.overview,
    fallback?.overview as string,
    enText.overview
  );
  const item = mapItem(
    {
      ...primary,
      title: titleName,
      name: titleName,
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
      ...((fallback?.similar as ListResponse)?.results ?? []),
    ].map((row) => mapItem(row, type))
  ).slice(0, 12);

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
  };
}

export async function homeCatalog(lang: string) {
  const [trending, movies, series, ramadan, anime, arabic, turkish, asian] = await Promise.all([
    discover("trending", lang),
    discover("movies", lang),
    discover("series", lang),
    discoverCatalog("tv", "ramadan", lang),
    discover("anime", lang),
    discover("arabic", lang),
    discover("turkish", lang),
    discover("asian", lang),
  ]);
  const row = (result: DiscoverResult) => result.items.slice(0, 20);
  return {
    trending: row(trending),
    movies: row(movies),
    series: row(series),
    ramadan: row(ramadan),
    anime: row(anime),
    arabic: row(arabic),
    turkish: row(turkish),
    asian: row(asian),
  };
}
