import { NextRequest, NextResponse } from "next/server";
import { getTitle } from "../../../lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = req.nextUrl.searchParams.get("lang") ?? "ar";
  const title = await getTitle("movie", Number(id), lang);
  if (!title) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(title);
}
