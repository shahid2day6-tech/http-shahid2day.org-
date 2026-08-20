import { NextRequest, NextResponse } from "next/server";
import { getTvSeason } from "../../../../../lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  const { id, season } = await params;
  const lang = req.nextUrl.searchParams.get("lang") ?? "ar";
  const data = await getTvSeason(Number(id), Number(season), lang);
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" },
  });
}
