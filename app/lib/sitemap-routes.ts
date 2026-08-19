import { MOVIE_GROUPS, RAMADAN_GROUPS, SERIES_GROUPS, catalogHref } from "./catalog";
import { SORT_MODES } from "./filters";
import { SITE_URL } from "./site";

export const SITEMAP_CORE_COUNT = 5;
export const ANIME_TV_PAGES = 500;
export const ANIME_MOVIE_PAGES = 200;
export const ANIME_PAGES_PER_FILE = 15;
export const ANIME_TV_CHUNKS = Math.ceil(ANIME_TV_PAGES / ANIME_PAGES_PER_FILE);
export const ANIME_MOVIE_CHUNKS = Math.ceil(ANIME_MOVIE_PAGES / ANIME_PAGES_PER_FILE);
export const SITEMAP_COUNT = SITEMAP_CORE_COUNT + ANIME_TV_CHUNKS + ANIME_MOVIE_CHUNKS;

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
