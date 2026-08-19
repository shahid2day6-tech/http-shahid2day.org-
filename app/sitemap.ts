import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";
import {
  ANIME_PAGES_PER_FILE,
  ANIME_SITEMAP_STREAMS,
  SITEMAP_CORE_COUNT,
  SITEMAP_COUNT,
  staticSitemapPaths,
} from "./lib/sitemap-routes";
import { titleHref } from "./lib/slug";
import {
  discoverFranchises,
  listAdultAnime,
  listFeaturedAnime,
  listKoreanTitles,
  listTurkishTitles,
  listForeignTitles,
  listSitemapItems,
  type MediaItem,
} from "./lib/tmdb";

export const revalidate = 3600;
export const maxDuration = 60;

function loc(path: string, changeFrequency: "daily" | "hourly" = "daily", priority = 0.8): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

function titleEntries(items: MediaItem[]): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const item of items) {
    const path = item.href ?? titleHref(item);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push(loc(path, "daily", 0.7));
  }
  return out;
}

function chunkRange(chunk: number, totalPages: number): { startPage: number; count: number } {
  const startPage = chunk * ANIME_PAGES_PER_FILE + 1;
  const count = Math.min(ANIME_PAGES_PER_FILE, totalPages - startPage + 1);
  return { startPage, count: Math.max(0, count) };
}

export async function generateSitemaps() {
  return Array.from({ length: SITEMAP_COUNT }, (_, id) => ({ id }));
}

export default async function sitemap(props: {
  id: number | string | Promise<number | string>;
}): Promise<MetadataRoute.Sitemap> {
  const index = Number(await Promise.resolve(props.id));
  if (!Number.isFinite(index) || index < 0 || index >= SITEMAP_COUNT) return [];

  if (index === 0) {
    return staticSitemapPaths().map((route) => loc(route, "daily", route === "" ? 1 : 0.8));
  }

  if (index === 1) {
    return titleEntries(await listSitemapItems("/discover/movie", { sort_by: "popularity.desc" }, 20));
  }

  if (index === 2) {
    return titleEntries(await listSitemapItems("/discover/tv", { sort_by: "popularity.desc" }, 20));
  }

  if (index === 3) {
    const [adultAnime, featuredAnime, koreanTitles, turkishTitles, foreignTitles, asianTv, asianMovies] = await Promise.all([
      listAdultAnime("en"),
      listFeaturedAnime("en"),
      listKoreanTitles("en"),
      listTurkishTitles("en"),
      listForeignTitles("en"),
      listSitemapItems("/discover/tv", { with_origin_country: "JP|KR|CN|TH", without_genres: "16", sort_by: "popularity.desc" }, 8),
      listSitemapItems("/discover/movie", { with_origin_country: "JP|KR|CN|TH", without_genres: "16", sort_by: "popularity.desc" }, 8),
    ]);
    return titleEntries([...featuredAnime, ...adultAnime, ...koreanTitles, ...turkishTitles, ...foreignTitles, ...asianTv, ...asianMovies]);
  }

  if (index === 4) {
    const [arabicTv, arabicMovies, turkishTv, turkishMovies, ramadan, franchises] = await Promise.all([
      listSitemapItems("/discover/tv", { with_original_language: "ar", sort_by: "popularity.desc" }, 8),
      listSitemapItems("/discover/movie", { with_original_language: "ar", sort_by: "popularity.desc" }, 8),
      listSitemapItems("/discover/tv", { with_original_language: "tr", sort_by: "popularity.desc" }, 8),
      listSitemapItems("/discover/movie", { with_original_language: "tr", sort_by: "popularity.desc" }, 8),
      listSitemapItems("/discover/tv", { with_original_language: "ar", with_keywords: "297545", sort_by: "popularity.desc" }, 4),
      discoverFranchises("en", 1),
    ]);
    return [
      ...titleEntries([...arabicTv, ...arabicMovies, ...turkishTv, ...turkishMovies, ...ramadan]),
      ...titleEntries(franchises.items),
    ];
  }

  let offset = SITEMAP_CORE_COUNT;
  for (const stream of ANIME_SITEMAP_STREAMS) {
    const chunks = Math.ceil(stream.pages / ANIME_PAGES_PER_FILE);
    if (index >= offset && index < offset + chunks) {
      const { startPage, count } = chunkRange(index - offset, stream.pages);
      if (count <= 0) return [];
      return titleEntries(await listSitemapItems(stream.path, stream.params, count, startPage));
    }
    offset += chunks;
  }

  return [];
}
