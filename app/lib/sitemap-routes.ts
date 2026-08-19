import { MOVIE_GROUPS, RAMADAN_GROUPS, SERIES_GROUPS, catalogHref } from "./catalog";
import { SORT_MODES } from "./filters";
import { SITE_URL } from "./site";

export const SITEMAP_CORE_COUNT = 5;
export const ANIME_PAGES_PER_FILE = 15;

export const ANIME_SITEMAP_STREAMS: Array<{
  path: "/discover/tv" | "/discover/movie";
  params: Record<string, string>;
  pages: number;
}> = [
  { path: "/discover/tv", params: { with_genres: "16", with_origin_country: "JP", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/movie", params: { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/tv", params: { with_genres: "16", with_original_language: "zh", sort_by: "popularity.desc" }, pages: 130 },
  { path: "/discover/movie", params: { with_genres: "16", with_original_language: "zh", sort_by: "popularity.desc" }, pages: 80 },
  { path: "/discover/tv", params: { with_genres: "16", with_original_language: "ko", sort_by: "popularity.desc" }, pages: 30 },
  { path: "/discover/movie", params: { with_genres: "16", with_original_language: "ko", sort_by: "popularity.desc" }, pages: 40 },
  { path: "/discover/tv", params: { with_original_language: "ko", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/movie", params: { with_original_language: "ko", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/tv", params: { with_original_language: "tr", sort_by: "popularity.desc" }, pages: 123 },
  { path: "/discover/movie", params: { with_original_language: "tr", sort_by: "popularity.desc" }, pages: 483 },
  { path: "/discover/movie", params: { with_original_language: "en", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/tv", params: { with_original_language: "en", without_genres: "16", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/movie", params: { with_original_language: "es", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/tv", params: { with_original_language: "es", without_genres: "16", sort_by: "popularity.desc" }, pages: 367 },
  { path: "/discover/movie", params: { with_original_language: "fr", sort_by: "popularity.desc" }, pages: 500 },
  { path: "/discover/tv", params: { with_original_language: "fr", without_genres: "16", sort_by: "popularity.desc" }, pages: 447 },
];

export const SITEMAP_COUNT =
  SITEMAP_CORE_COUNT +
  ANIME_SITEMAP_STREAMS.reduce((n, stream) => n + Math.ceil(stream.pages / ANIME_PAGES_PER_FILE), 0);

export function staticSitemapPaths(): string[] {
  return [
    "",
    "/about",
    "/movies",
    "/series",
    "/browse",
    "/anime",
    "/arabic",
    "/turkish",
    "/asian",
    ...MOVIE_GROUPS.map((item) => catalogHref("movie", item.group)),
    ...SERIES_GROUPS.map((item) => catalogHref("tv", item.group)),
    ...RAMADAN_GROUPS.map((item) => catalogHref("tv", item.group)),
    ...SORT_MODES.map((mode) => `/browse?sort=${mode.id}`),
  ];
}

export function sitemapIndexXml(): string {
  const now = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...Array.from({ length: SITEMAP_COUNT }, (_, id) =>
      [`<sitemap>`, `<loc>${SITE_URL}/sitemap/${id}.xml</loc>`, `<lastmod>${now}</lastmod>`, `</sitemap>`].join("")
    ),
    `</sitemapindex>`,
  ].join("");
}

export function sitemapUrlset(paths: string[]): string {
  const today = new Date().toISOString();
  const urls = paths
    .map((path) => {
      const priority = path === "" ? "1.0" : "0.8";
      return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
