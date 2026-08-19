import { revalidatePath, revalidateTag } from "next/cache";
import {
  MOVIE_GROUPS,
  RAMADAN_GROUPS,
  SERIES_GROUPS,
  catalogHref,
} from "./catalog";
import { SITE_URL } from "./site";
import { SITEMAP_COUNT } from "./sitemap-routes";
import { titleHref } from "./slug";
import { submitIndexNow } from "./indexnow";
import {
  discoverBrowse,
  discoverFranchises,
  discoverNewEpisodes,
  homeCatalog,
  listAdultAnime,
  listKoreanTitles,
  listTurkishTitles,
  listForeignTitles,
  type CategoryKey,
} from "./tmdb";

const LANGS = ["ar", "en"] as const;
const CATEGORIES: CategoryKey[] = ["trending", "movies", "series", "anime"];
const EPISODE_GROUPS = ["foreign", "anime", "arabic"] as const;

const SECTION_PATHS = [
  "/",
  "/movies",
  "/series",
  "/anime",
  "/browse",
  "/arabic",
  "/turkish",
  "/asian",
  ...MOVIE_GROUPS.map((item) => catalogHref("movie", item.group)),
  ...SERIES_GROUPS.map((item) => catalogHref("tv", item.group)),
  ...RAMADAN_GROUPS.map((item) => catalogHref("tv", item.group)),
];

const WARM_PATHS = [
  ...SECTION_PATHS,
  "/api/discover?category=trending&lang=ar",
  "/api/discover?category=movies&lang=ar",
  "/api/discover?category=movies&lang=en",
  "/api/discover?category=series&lang=ar",
  "/api/discover?category=series&lang=en",
  "/api/discover?category=anime&lang=ar",
  "/api/discover?category=anime&lang=en",
  ...MOVIE_GROUPS.filter((item) => item.group !== "franchises").map(
    (item) => `/api/discover?kind=movie&group=${item.group}&lang=ar`
  ),
  ...SERIES_GROUPS.map((item) => `/api/discover?kind=tv&group=${item.group}&lang=ar`),
  "/sitemap.xml",
  "/sitemap-index",
  "/sitemap/0.xml",
  "/sitemap/1.xml",
  "/sitemap/2.xml",
  "/sitemap/3.xml",
  "/sitemap/4.xml",
];

async function settledCount(jobs: Promise<unknown>[]): Promise<{ ok: number; failed: number }> {
  const results = await Promise.allSettled(jobs);
  return {
    ok: results.filter((item) => item.status === "fulfilled").length,
    failed: results.filter((item) => item.status === "rejected").length,
  };
}

export async function refreshCatalog() {
  const started = Date.now();

  const fetched = await settledCount([
    ...LANGS.flatMap((lang) => [
      homeCatalog(lang),
      ...CATEGORIES.map((category) => discoverBrowse({ category }, lang, 1)),
      ...EPISODE_GROUPS.map((group) => discoverNewEpisodes(group, lang)),
      ...MOVIE_GROUPS.filter((item) => item.group !== "franchises").map((item) =>
        discoverBrowse({ kind: "movie", group: item.group }, lang, 1)
      ),
      ...SERIES_GROUPS.map((item) => discoverBrowse({ kind: "tv", group: item.group }, lang, 1)),
      ...RAMADAN_GROUPS.map((item) => discoverBrowse({ kind: "tv", group: item.group }, lang, 1)),
    ]),
    discoverFranchises("ar", 1),
  ]);

  revalidateTag("catalog");
  revalidateTag("tmdb");
  for (const path of SECTION_PATHS) revalidatePath(path);
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-index");
  for (let id = 0; id < SITEMAP_COUNT; id += 1) revalidatePath(`/sitemap/${id}.xml`);

  const warmed = await settledCount(
    WARM_PATHS.map((path) =>
      fetch(`${SITE_URL}${path}`, { cache: "no-store", redirect: "follow" }).then((res) => {
        if (!res.ok) throw new Error(`${path} ${res.status}`);
        return res.status;
      })
    )
  );

  const adult = await listAdultAnime("en");
  const korean = await listKoreanTitles("en");
  const turkish = await listTurkishTitles("en");
  const foreign = await listForeignTitles("en");
  const indexnow = await submitIndexNow([
    SITE_URL,
    `${SITE_URL}/`,
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/sitemap-index`,
    `${SITE_URL}/sitemap/0.xml`,
    `${SITE_URL}/sitemap/3.xml`,
    ...adult.map((item) => `${SITE_URL}${item.href ?? titleHref(item)}`),
    ...korean.map((item) => `${SITE_URL}${item.href ?? titleHref(item)}`),
    ...turkish.map((item) => `${SITE_URL}${item.href ?? titleHref(item)}`),
    ...foreign.map((item) => `${SITE_URL}${item.href ?? titleHref(item)}`),
  ]);

  return {
    ok: true,
    at: new Date().toISOString(),
    ms: Date.now() - started,
    fetched,
    warmed,
    indexnow,
    sections: {
      movies: MOVIE_GROUPS.map((item) => item.group),
      series: SERIES_GROUPS.map((item) => item.group),
      episodes: [...EPISODE_GROUPS],
    },
  };
}
