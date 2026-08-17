import { NextResponse } from "next/server";
import {
  buildAdsterraFrameHtml,
  isAdsterraBannerSize,
  isAdsterraEnabled,
} from "../../lib/adsterra";
import { isSearchCrawlerUserAgent } from "../../lib/isSearchCrawler";

export function GET(request: Request) {
  if (!isAdsterraEnabled()) {
    return new NextResponse("disabled", { status: 404 });
  }
  if (isSearchCrawlerUserAgent(request.headers.get("user-agent"))) {
    return new NextResponse("", { status: 204 });
  }

  const size = new URL(request.url).searchParams.get("size") || "";
  if (!isAdsterraBannerSize(size)) {
    return new NextResponse("invalid size", { status: 400 });
  }

  const html = buildAdsterraFrameHtml(size, "s2d-adsterra");
  if (!html) {
    return new NextResponse("missing key", { status: 404 });
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}
