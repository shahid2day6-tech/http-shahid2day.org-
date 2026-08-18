import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";
import { staticSitemapPaths } from "./lib/sitemap-routes";
import { titleHref } from "./lib/slug";
import {
  discoverFranchises,
  listAdultAnime,
  listSitemapItems,
  type MediaItem,
} from "./lib/tmdb";

export const revalidate = 3600;

const SITEMAP_COUNT = 5;

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

export async function generateSitemaps() {
  return Array.from({ length: SITEMAP_COUNT }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number | string }): Promise<MetadataRoute.Sitemap> {
  const index = Number(id);

  if (index === 0) {
    return staticSitemapPaths().map((route) => loc(route, "daily", route === "" ? 1 : 0.8));
  }

  if (index === 1) {
    return titleEntries(
      await listSitemapItems("/discover/movie", { sort_by: "popularity.desc" }, 20)
    );
  }

  if (index === 2) {
    return titleEntries(
      await listSitemapItems("/discover/tv", { sort_by: "popularity.desc" }, 20)
    );
  }

  if (index === 3) {
    const [animeTv, animeMovies, asianTv, asianMovies, adultAnime] = await Promise.all([
      listSitemapItems("/discover/tv", { with_genres: "16", with_origin_country: "JP", sort_by: "popularity.desc" }, 12),
      listSitemapItems("/discover/movie", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc" }, 12),
      listSitemapItems("/discover/tv", { with_origin_country: "JP|KR|CN|TH", without_genres: "16", sort_by: "popularity.desc" }, 8),
      listSitemapItems("/discover/movie", { with_origin_country: "JP|KR|CN|TH", without_genres: "16", sort_by: "popularity.desc" }, 8),
      listAdultAnime("en"),
    ]);
    return titleEntries([...adultAnime, ...animeTv, ...animeMovies, ...asianTv, ...asianMovies]);
  }

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
