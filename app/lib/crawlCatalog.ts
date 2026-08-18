import { isBlockedTitle } from "./blockedTitles";
import { SITE_URL } from "./site";
import { titleHref } from "./slug";

const TMDB_KEY = process.env.TMDB_API_KEY ?? "";
const TMDB_BASE = "https://api.themoviedb.org/3";

export type CrawlLink = {
  href: string;
  label: string;
  type: "movie" | "tv";
};

type TmdbList = {
  results?: Array<{
    id?: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    original_language?: string;
    poster_path?: string | null;
    release_date?: string;
    first_air_date?: string;
  }>;
};

async function fetchList(path: string): Promise<TmdbList> {
  if (!TMDB_KEY || TMDB_KEY === "YOUR_TMDB_API_KEY_HERE") return {};
  try {
    const res = await fetch(`${TMDB_BASE}${path}`, {
      next: { revalidate: 3600, tags: ["catalog", "tmdb"] },
    } as RequestInit);
    if (!res.ok) return {};
    return (await res.json()) as TmdbList;
  } catch {
    return {};
  }
}

function latinTitle(...values: Array<string | undefined | null>): string {
  const cleaned = values.map((value) => String(value ?? "").trim()).filter(Boolean);
  const stripped = cleaned.map((value) =>
    value
      .replace(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uac00-\ud7af]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
  return stripped.find((value) => /[A-Za-z]{2,}/.test(value)) || "";
}

function mapResults(
  data: TmdbList,
  type: "movie" | "tv",
  kindWord: string
): CrawlLink[] {
  const out: CrawlLink[] = [];
  for (const row of data.results ?? []) {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0 || !row.poster_path || isBlockedTitle(type, id)) continue;
    const localized = (type === "tv" ? row.name : row.title) || "";
    const original = (type === "tv" ? row.original_name : row.original_title) || "";
    const slugTitle = latinTitle(localized, original);
    if (!slugTitle) continue;
    const year = ((type === "tv" ? row.first_air_date : row.release_date) || "").slice(0, 4);
    out.push({
      type,
      href: titleHref({
        title: slugTitle,
        type,
        year,
        originalLanguage: row.original_language || "en",
      }),
      label: `مشاهدة ${kindWord} ${slugTitle}${year ? ` ${year}` : ""} مترجم شاهد تو داي`,
    });
  }
  return out;
}

export async function getCrawlCatalog(kind: "home" | "movies" | "series" = "home"): Promise<CrawlLink[]> {
  if (kind === "movies") {
    const [popular, nowPlaying] = await Promise.all([
      fetchList(`/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`),
      fetchList(`/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=1`),
    ]);
    return uniqueLinks([
      ...mapResults(nowPlaying, "movie", "فيلم"),
      ...mapResults(popular, "movie", "فيلم"),
    ]);
  }

  if (kind === "series") {
    const [popular, onAir] = await Promise.all([
      fetchList(`/tv/popular?api_key=${TMDB_KEY}&language=en-US&page=1`),
      fetchList(`/tv/on_the_air?api_key=${TMDB_KEY}&language=en-US&page=1`),
    ]);
    return uniqueLinks([
      ...mapResults(onAir, "tv", "مسلسل"),
      ...mapResults(popular, "tv", "مسلسل"),
    ]);
  }

  const [movies, series] = await Promise.all([
    fetchList(`/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`),
    fetchList(`/tv/popular?api_key=${TMDB_KEY}&language=en-US&page=1`),
  ]);
  return uniqueLinks([
    ...mapResults(movies, "movie", "فيلم"),
    ...mapResults(series, "tv", "مسلسل"),
  ]);
}

function uniqueLinks(links: CrawlLink[]): CrawlLink[] {
  const seen = new Set<string>();
  const out: CrawlLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
  }
  return out.slice(0, 48);
}

export function crawlItemListSchema(links: CrawlLink[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أفلام ومسلسلات مترجمة اون لاين — شاهد تو داي",
    itemListElement: links.slice(0, 40).map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${link.href}`,
      name: link.label,
    })),
  };
}
