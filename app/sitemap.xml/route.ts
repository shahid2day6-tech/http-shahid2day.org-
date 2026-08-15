import { NextResponse } from "next/server";
import { sitemapUrlset, staticSitemapPaths } from "../lib/sitemap-routes";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse(sitemapUrlset(staticSitemapPaths()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
