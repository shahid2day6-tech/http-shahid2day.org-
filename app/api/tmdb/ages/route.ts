import { NextResponse } from "next/server";
import { fetchTmdbAgeCodes } from "../../../lib/tmdbAge";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function parseIds(raw: string | null) {
  return (raw ?? "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((id) => Number.isFinite(id) && id > 0)
    .slice(0, 40);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const movies = parseIds(url.searchParams.get("movies"));
  const tv = parseIds(url.searchParams.get("tv"));
  if (!movies.length && !tv.length) {
    return NextResponse.json({ movies: {}, tv: {} });
  }
  const ages = await fetchTmdbAgeCodes(movies, tv);
  return NextResponse.json(ages, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
