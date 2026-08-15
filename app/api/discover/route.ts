import { NextRequest, NextResponse } from "next/server";
import { isMovieGroup, isTvCatalogGroup, type CatalogGroup, type CatalogKind } from "../../lib/catalog";
import { isCatalogSort } from "../../lib/filters";
import { discoverBrowse, discoverFiltered, type CategoryKey, type DiscoverResult } from "../../lib/tmdb";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const CATEGORIES: CategoryKey[] = [
  "trending",
  "movies",
  "series",
  "anime",
  "arabic",
  "turkish",
  "asian",
];

function json(data: DiscoverResult, status = 200) {
  return NextResponse.json(
    {
      results: data.items,
      page: data.page,
      totalPages: data.totalPages,
      totalResults: data.totalResults,
    },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") ?? "ar";
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1") || 1);
  const kind = req.nextUrl.searchParams.get("kind") as CatalogKind | null;
  const group = req.nextUrl.searchParams.get("group") as CatalogGroup | null;
  const sortParam = req.nextUrl.searchParams.get("sort");
  const sort = isCatalogSort(sortParam) ? sortParam : undefined;
  const genre = req.nextUrl.searchParams.get("genre") || undefined;
  const yearParam = req.nextUrl.searchParams.get("year");
  const year = yearParam && yearParam !== "all" ? yearParam : undefined;
  const sectionParam = req.nextUrl.searchParams.get("section");
  const section = sectionParam && sectionParam !== "all" ? sectionParam : undefined;
  const filters = { sort, genre, year };

  if (section || genre || year || (sort && !kind && !group)) {
    const data = await discoverFiltered(lang, page, { section, sort, genre, year });
    return json(data);
  }

  if (kind === "movie" && group && isMovieGroup(group)) {
    return json(await discoverBrowse({ kind: "movie", group }, lang, page, filters));
  }
  if (kind === "tv" && group && isTvCatalogGroup(group)) {
    return json(await discoverBrowse({ kind: "tv", group }, lang, page, filters));
  }

  const category = (req.nextUrl.searchParams.get("category") ?? "trending") as CategoryKey;
  if (!CATEGORIES.includes(category)) {
    return json({ items: [], page: 1, totalPages: 1, totalResults: 0 }, 400);
  }
  return json(await discoverBrowse({ category }, lang, page, filters));
}
