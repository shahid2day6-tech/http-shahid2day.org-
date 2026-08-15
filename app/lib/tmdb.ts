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

type ListResponse = { results?: Record<string, unknown>[] };

export async function discover(
  category: CategoryKey,
  lang: string,
  page = 1
): Promise<MediaItem[]> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const common = { language, page, include_adult: "false" };

  if (category === "trending") {
    const data = await tmdb<ListResponse>("/trending/all/day", { language });
    return (data?.results ?? [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => mapItem(item));
  }

  if (category === "movies") {
    const data = await tmdb<ListResponse>("/discover/movie", {
      ...common,
      sort_by: "popularity.desc",
    });
    return (data?.results ?? []).map((item) => mapItem(item, "movie"));
  }

  if (category === "series") {
    const data = await tmdb<ListResponse>("/discover/tv", {
      ...common,
      sort_by: "popularity.desc",
    });
    return (data?.results ?? []).map((item) => mapItem(item, "tv"));
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
    return mergeLists(
      (tv?.results ?? []).map((item) => mapItem(item, "tv")),
      (movies?.results ?? []).map((item) => mapItem(item, "movie"))
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
      sort_by: "popularity.desc",
    }),
    tmdb<ListResponse>("/discover/movie", {
      ...common,
      with_origin_country: "JP|KR|CN|TH|IN|TW|HK",
      sort_by: "popularity.desc",
    }),
  ]);
  return mergeLists(
    (tv?.results ?? []).map((item) => mapItem(item, "tv")),
    (movies?.results ?? []).map((item) => mapItem(item, "movie"))
  );
}

async function discoverByLanguage(
  original: string,
  language: string,
  page: number
): Promise<MediaItem[]> {
  const common = { language, page, include_adult: "false", with_original_language: original, sort_by: "popularity.desc" };
  const [tv, movies] = await Promise.all([
    tmdb<ListResponse>("/discover/tv", common),
    tmdb<ListResponse>("/discover/movie", common),
  ]);
  return mergeLists(
    (tv?.results ?? []).map((item) => mapItem(item, "tv")),
    (movies?.results ?? []).map((item) => mapItem(item, "movie"))
  );
}

function mergeLists(a: MediaItem[], b: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return [...a, ...b]
    .filter((item) => {
      const k = `${item.type}-${item.id}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return Boolean(item.poster);
    })
    .sort((x, y) => Number(y.rating) - Number(x.rating))
    .slice(0, 20);
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

export async function getTitle(
  type: MediaType,
  id: number,
  lang: string
): Promise<TitleDetails | null> {
  const language = lang.startsWith("ar") ? "ar-SA" : "en-US";
  const data = await tmdb<Record<string, unknown>>(`/${type}/${id}`, {
    language,
    append_to_response: "videos,credits,similar,watch/providers",
  });
  if (!data) return null;

  const videos = (data.videos as { results?: { type: string; site: string; key: string }[] })
    ?.results ?? [];
  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer")?.key ??
    videos.find((v) => v.site === "YouTube")?.key ??
    null;

  const cast = ((data.credits as { cast?: Record<string, unknown>[] })?.cast ?? [])
    .slice(0, 8)
    .map((person) => ({
      name: String(person.name ?? ""),
      character: String(person.character ?? ""),
      photo: posterUrl((person.profile_path as string | null) ?? null, "w185"),
    }));

  const similar = ((data.similar as ListResponse)?.results ?? [])
    .slice(0, 12)
    .map((item) => mapItem(item, type));

  const providerRoot = data["watch/providers"] as {
    results?: Record<string, { flatrate?: { provider_name: string; logo_path: string | null }[] }>;
  };
  const region = providerRoot?.results?.SA ?? providerRoot?.results?.AE ?? providerRoot?.results?.US;
  const providers = (region?.flatrate ?? []).slice(0, 6).map((p) => ({
    name: p.provider_name,
    logo: posterUrl(p.logo_path, "w92"),
  }));

  const runtimeMinutes =
    type === "movie"
      ? Number(data.runtime ?? 0)
      : Number((data.episode_run_time as number[] | undefined)?.[0] ?? 0);

  return {
    ...mapItem(data, type),
    genres: ((data.genres as { name: string }[]) ?? []).map((g) => g.name),
    runtime: runtimeMinutes ? `${runtimeMinutes} د` : "",
    trailer,
    cast,
    similar,
    providers,
    seasons: type === "tv" ? Number(data.number_of_seasons ?? 0) : undefined,
    homepage: (data.homepage as string | null) ?? null,
  };
}

export async function homeCatalog(lang: string) {
  const [trending, movies, series, anime, arabic, turkish, asian] = await Promise.all([
    discover("trending", lang),
    discover("movies", lang),
    discover("series", lang),
    discover("anime", lang),
    discover("arabic", lang),
    discover("turkish", lang),
    discover("asian", lang),
  ]);
  return { trending, movies, series, anime, arabic, turkish, asian };
}
