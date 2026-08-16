"use client";

import { useEffect, useState } from "react";
import {
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

  if (!owned || !key) return null;

  return (
    <iframe
      src={`/ads/adsterra?size=${size}`}
      width={width}
      height={height}
      title="Advertisement"
      scrolling="no"
      referrerPolicy="no-referrer-when-downgrade"
      allowTransparency
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
