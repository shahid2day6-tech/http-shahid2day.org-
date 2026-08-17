"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADSTERRA_INVOKE_HOST,
  claimAdsterraSize,
  getAdsterraDims,
  getAdsterraKey,
  isAdsterraBannersEnabled,
  isAdsterraEnabled,
  releaseAdsterraSize,
  type AdsterraBannerSize,
} from "../../lib/adsterra";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

type Props = {
  size: AdsterraBannerSize;
  className?: string;
  skipClaim?: boolean;
  nativeSize?: boolean;
};

function bannerHtml(key: string, width: number, height: number) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="referrer" content="origin">
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:transparent;width:${width}px;height:${height}px}
</style>
</head>
<body>
<script>
window.atOptions = {
  key: ${JSON.stringify(key)},
  format: "iframe",
  height: ${height},
  width: ${width},
  params: {}
};
</script>
<script src="${ADSTERRA_INVOKE_HOST}/${key}/invoke.js"></script>
</body>
</html>`;
}

export function useAdsterraSlot(size: AdsterraBannerSize | null) {
  const [owned, setOwned] = useState(false);

  useEffect(() => {
    if (
      !size ||
      !isAdsterraEnabled() ||
      !isAdsterraBannersEnabled() ||
      isBrowserSearchCrawler() ||
      !getAdsterraKey(size)
    ) {
      setOwned(false);
      return;
    }
    const ok = claimAdsterraSize(size);
    setOwned(ok);
    return () => {
      if (ok) releaseAdsterraSize(size);
      setOwned(false);
    };
  }, [size]);

  return owned;
}

export function AdsterraBanner({ size, className = "", skipClaim = false, nativeSize = false }: Props) {
  const key = getAdsterraKey(size);
  const { width, height } = getAdsterraDims(size);
  const [owned, setOwned] = useState(skipClaim);
  const html = useMemo(
    () => (key ? bannerHtml(key, width, height) : ""),
    [key, width, height]
  );

  useEffect(() => {
    if (skipClaim) {
      setOwned(true);
      return;
    }
    if (!isAdsterraEnabled() || !isAdsterraBannersEnabled() || isBrowserSearchCrawler() || !key) {
      setOwned(false);
      return;
    }
    const ok = claimAdsterraSize(size);
    setOwned(ok);
    return () => {
      if (ok) releaseAdsterraSize(size);
      setOwned(false);
    };
  }, [size, skipClaim, key]);

  if (!owned || !key || !html) return null;

  return (
    <iframe
      srcDoc={html}
      width={width}
      height={height}
      title="Advertisement"
      scrolling="no"
      referrerPolicy="origin"
      className={className}
      style={{
        width,
        height,
        maxWidth: nativeSize ? width : "100%",
        border: 0,
        overflow: "hidden",
        display: "block",
        background: "transparent",
        flexShrink: 0,
      }}
    />
  );
}
