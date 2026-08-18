"use client";

import { useEffect, useState } from "react";
import { isAdsterraBannersEnabled, isAdsterraEnabled } from "../../lib/adsterra";
import { claimHilltop300, isHilltopBannersEnabled, releaseHilltop300 } from "../../lib/hilltop";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

export type CoverAdNetwork = "adsterra" | "hilltop";

function pickCoverAdNetwork(): CoverAdNetwork | null {
  if (isAdsterraEnabled() && isAdsterraBannersEnabled()) return "adsterra";
  if (isHilltopBannersEnabled()) return "hilltop";
  return null;
}

/** Between-cover slots: Adsterra 300×250 first, Hilltop only if Adsterra banners are off. */
export function useCoverAdNetwork(): CoverAdNetwork | null {
  const [net, setNet] = useState<CoverAdNetwork | null>(pickCoverAdNetwork);

  useEffect(() => {
    if (isBrowserSearchCrawler()) {
      setNet(null);
      return;
    }
    if (isAdsterraEnabled() && isAdsterraBannersEnabled()) {
      setNet("adsterra");
      return;
    }
    if (isHilltopBannersEnabled() && claimHilltop300()) {
      setNet("hilltop");
      return () => releaseHilltop300();
    }
    setNet(null);
  }, []);

  return net;
}
