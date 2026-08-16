import { NextResponse } from "next/server";
import {
  ADSTERRA_INVOKE_HOST,
  getAdsterraDims,
  getAdsterraKey,
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

  const key = getAdsterraKey(size);
  if (!key) {
    return new NextResponse("missing key", { status: 404 });
  }

  const { width, height } = getAdsterraDims(size);
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="referrer" content="origin">
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:transparent;width:${width}px;height:${height}px}
</style>
</head>
<body>
<script type="text/javascript">
atOptions = {
  key: ${JSON.stringify(key)},
  format: "iframe",
  height: ${height},
  width: ${width},
  params: {}
};
</script>
<script type="text/javascript" src="${ADSTERRA_INVOKE_HOST}/${key}/invoke.js"></script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "Content-Security-Policy": "frame-ancestors 'self'",
    },
  });
}
