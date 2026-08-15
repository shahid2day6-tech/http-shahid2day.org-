import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "../../lib/tmdb";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const lang = req.nextUrl.searchParams.get("lang") ?? "ar";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  const results = await searchMedia(q, lang);
  return NextResponse.json({ results });
}
