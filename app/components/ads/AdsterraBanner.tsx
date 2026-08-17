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
  wrapClassName?: string;
  label?: string;
  skipClaim?: boolean;
  nativeSize?: boolean;
  stayVisible?: boolean;
  collapseIfEmpty?: boolean;
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
  wrapClassName = "",
  label,
  skipClaim = false,
  nativeSize = false,
  stayVisible = false,
  collapseIfEmpty = true,
  onFilled,
  onEmpty,
}: Props) {
  const key = getAdsterraKey(size);
  const { width, height } = getAdsterraDims(size);
  const [owned, setOwned] = useState(skipClaim);
  const [empty, setEmpty] = useState(false);
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
    if (!owned) return;
    filledRef.current = false;
    setEmpty(false);

    function markEmpty() {
      if (filledRef.current) return;
      setEmpty(true);
      onEmptyRef.current?.();
    }

    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.source !== "s2d-adsterra" || data.size !== size) return;
      if (data.status === "filled") {
        filledRef.current = true;
        setEmpty(false);
        onFilledRef.current?.();
      } else if (data.status === "empty") {
        markEmpty();
      }
    }

    window.addEventListener("message", onMessage);
    const giveUp = window.setTimeout(markEmpty, 8000);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(giveUp);
    };
  }, [owned, size]);

  if (!owned || !key) return null;
  if (empty && collapseIfEmpty && !stayVisible) return null;

  const frame = (
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

  if (!label && !wrapClassName) return frame;

  return (
    <div className={wrapClassName} data-site-ui="1">
      {label ? (
        <span className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#a3a3a3]">
          {label}
        </span>
      ) : null}
      {frame}
    </div>
  );
}
