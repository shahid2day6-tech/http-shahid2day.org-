"use client";

import { useEffect, useRef, useState } from "react";
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
  onFilled?: () => void;
  onEmpty?: () => void;
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

export function AdsterraBanner({
  size,
  className = "",
  skipClaim = false,
  nativeSize = false,
  onFilled,
  onEmpty,
}: Props) {
  const key = getAdsterraKey(size);
  const { width, height } = getAdsterraDims(size);
  const [owned, setOwned] = useState(skipClaim);
  const onFilledRef = useRef(onFilled);
  const onEmptyRef = useRef(onEmpty);
  const filledRef = useRef(false);
  onFilledRef.current = onFilled;
  onEmptyRef.current = onEmpty;

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

  useEffect(() => {
    if (!owned || !onEmpty) return;

    filledRef.current = false;

    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.source !== "s2d-adsterra" || data.size !== size) return;
      if (data.status === "filled") {
        filledRef.current = true;
        onFilledRef.current?.();
      } else if (data.status === "empty" && !filledRef.current) {
        onEmptyRef.current?.();
      }
    }

    window.addEventListener("message", onMessage);
    const giveUp = window.setTimeout(() => {
      if (!filledRef.current) onEmptyRef.current?.();
    }, 8000);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(giveUp);
    };
  }, [owned, size, onEmpty]);

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
