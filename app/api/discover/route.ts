import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { isMovieGroup, isTvCatalogGroup, type CatalogGroup, type CatalogKind } from "../../lib/catalog";
import { isCatalogSort } from "../../lib/filters";
import { discoverBrowse, discoverFiltered, type CategoryKey } from "../../lib/tmdb";

const CATEGORIES: CategoryKey[] = [
  "trending",
  "movies",
  "series",
  "anime",
  "arabic",
  "turkish",
  "asian",
];

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang") ?? "ar";
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1") || 1);
  const kind = req.nextUrl.searchParams.get("kind") as CatalogKind | null;
  const group = req.nextUrl.searchParams.get("group") as CatalogGroup | null;
  const sortParam = req.nextUrl.searchParams.get("sort");
  const sort = isCatalogSort(sortParam) ? sortParam : undefined;
  const genre = req.nextUrl.searchParams.get("genre") ?? undefined;
  const year = req.nextUrl.searchParams.get("year") ?? undefined;
  const section = req.nextUrl.searchParams.get("section") ?? undefined;
  const filters = { sort, genre, year };

  if (section || (sort && !kind && !group)) {
    const data = await discoverFiltered(lang, page, { section, sort, genre, year });
    return NextResponse.json({
      results: data.items,
      page: data.page,
      totalPages: data.totalPages,
      totalResults: data.totalResults,
    });
  }

  if (kind === "movie" && group && isMovieGroup(group)) {
    const data = await discoverBrowse({ kind: "movie", group }, lang, page, filters);
    return NextResponse.json({
      results: data.items,
      page: data.page,
      totalPages: data.totalPages,
      totalResults: data.totalResults,
    });
  }
  if (kind === "tv" && group && isTvCatalogGroup(group)) {
    const data = await discoverBrowse({ kind: "tv", group }, lang, page, filters);
    return NextResponse.json({
      results: data.items,
      page: data.page,
      totalPages: data.totalPages,
      totalResults: data.totalResults,
    });
  }

  const category = (req.nextUrl.searchParams.get("category") ?? "trending") as CategoryKey;
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ results: [], page: 1, totalPages: 1, totalResults: 0 }, { status: 400 });
  }
  const data = await discoverBrowse({ category }, lang, page, filters);
  return NextResponse.json({
    results: data.items,
    page: data.page,
    totalPages: data.totalPages,
    totalResults: data.totalResults,
  });
}
