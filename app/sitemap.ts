import type { MetadataRoute } from "next";
import { MOVIE_GROUPS, RAMADAN_GROUPS, SERIES_GROUPS, catalogHref } from "./lib/catalog";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/movies",
    "/series",
    ...MOVIE_GROUPS.map((item) => catalogHref("movie", item.group)),
    ...SERIES_GROUPS.map((item) => catalogHref("tv", item.group)),
    ...RAMADAN_GROUPS.map((item) => catalogHref("tv", item.group)),
  ];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}
