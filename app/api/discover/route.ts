import { NextRequest, NextResponse } from "next/server";
import { isMovieGroup, isSeriesGroup, type CatalogGroup, type CatalogKind } from "../../lib/catalog";
import { discover, discoverCatalog, type CategoryKey } from "../../lib/tmdb";

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

  if (kind === "movie" && group && isMovieGroup(group)) {
    const data = await discoverCatalog("movie", group, lang, page);
    return NextResponse.json({
      results: data.items,
      page: data.page,
      totalPages: data.totalPages,
      totalResults: data.totalResults,
    });
  }
  if (kind === "tv" && group && isSeriesGroup(group)) {
    const data = await discoverCatalog("tv", group, lang, page);
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
  const data = await discover(category, lang, page);
  return NextResponse.json({
    results: data.items,
    page: data.page,
    totalPages: data.totalPages,
    totalResults: data.totalResults,
  });
}
