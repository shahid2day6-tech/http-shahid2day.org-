import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_URL } from "./site";
import { discoverBrowse, discoverFranchises, homeCatalog, type CategoryKey } from "./tmdb";

const LANGS = ["ar", "en"] as const;
const CATEGORIES: CategoryKey[] = ["trending", "movies", "series", "anime"];
const PAGE_PATHS = ["/", "/movies", "/series", "/anime", "/browse", "/arabic", "/turkish", "/asian"];
const WARM_PATHS = [
  "/",
  "/movies",
  "/series",
  "/anime",
  "/browse",
  "/api/discover?category=trending&lang=ar",
  "/api/discover?category=movies&lang=ar",
  "/api/discover?category=movies&lang=en",
  "/api/discover?category=series&lang=ar",
  "/api/discover?category=series&lang=en",
  "/api/discover?category=anime&lang=ar",
  "/api/discover?category=anime&lang=en",
  "/sitemap.xml",
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
    ]),
    discoverFranchises("ar", 1),
  ]);

  revalidateTag("catalog");
  revalidateTag("tmdb");
  for (const path of PAGE_PATHS) revalidatePath(path);
  revalidatePath("/sitemap.xml");
  for (const id of [0, 1, 2, 3, 4]) revalidatePath(`/sitemap/${id}.xml`);

  const warmed = await settledCount(
    WARM_PATHS.map((path) =>
      fetch(`${SITE_URL}${path}`, { cache: "no-store", redirect: "follow" }).then((res) => {
        if (!res.ok) throw new Error(`${path} ${res.status}`);
        return res.status;
      })
    )
  );

  return {
    ok: true,
    at: new Date().toISOString(),
    ms: Date.now() - started,
    fetched,
    warmed,
  };
}
