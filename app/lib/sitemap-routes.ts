import { MOVIE_GROUPS, RAMADAN_GROUPS, SERIES_GROUPS, catalogHref } from "./catalog";
import { SORT_MODES } from "./filters";
import { SITE_URL } from "./site";

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
