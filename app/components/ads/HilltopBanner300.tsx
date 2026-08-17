"use client";

import { useEffect, useRef, useState } from "react";
import {
  claimHilltop300,
  HILLTOP_BANNER_300x250_SRC,
  isHilltopBannersEnabled,
  releaseHilltop300,
} from "../../lib/hilltop";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

export function HilltopBanner300({
  className = "",
  skipClaim = false,
}: {
  className?: string;
  skipClaim?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [owned, setOwned] = useState(skipClaim);

  useEffect(() => {
    if (skipClaim) {
      setOwned(true);
      return;
    }
    if (!isHilltopBannersEnabled() || isBrowserSearchCrawler()) {
      setOwned(false);
      return;
    }
    const ok = claimHilltop300();
    setOwned(ok);
    return () => {
      if (ok) releaseHilltop300();
      setOwned(false);
    };
  }, [skipClaim]);

  useEffect(() => {
    const el = boxRef.current;
    if (!owned || !el) return;
    el.replaceChildren();
    const script = document.createElement("script");
    script.src = HILLTOP_BANNER_300x250_SRC;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    el.appendChild(script);
    return () => {
      el.replaceChildren();
    };
  }, [owned]);

  if (!owned) return null;

  return (
    <div
      ref={boxRef}
      className={className}
      data-hilltop-zone="7328725"
      style={{ width: 300, height: 250, overflow: "hidden", flexShrink: 0 }}
    />
  );
}
