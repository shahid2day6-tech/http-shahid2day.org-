import { NextResponse } from "next/server";
import { SITE_URL } from "../lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[0, 1, 2, 3, 4]
  .map(
    (id) => `  <sitemap>
    <loc>${SITE_URL}/sitemap/${id}.xml</loc>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>
`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
