import { NextResponse } from "next/server";
import { sitemapIndexXml } from "../lib/sitemap-routes";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  return new NextResponse(sitemapIndexXml(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
