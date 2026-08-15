import { NextRequest, NextResponse } from "next/server";
import { discover, type CategoryKey } from "../../lib/tmdb";

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
  const category = (req.nextUrl.searchParams.get("category") ?? "trending") as CategoryKey;
  const lang = req.nextUrl.searchParams.get("lang") ?? "ar";
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }
  const results = await discover(category, lang, page);
  return NextResponse.json({ results });
}
