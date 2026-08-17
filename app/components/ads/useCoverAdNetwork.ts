"use client";

import { useEffect, useState } from "react";
import {
  claimAdsterraSize,
  isAdsterraBannersEnabled,
  isAdsterraEnabled,
  releaseAdsterraSize,
} from "../../lib/adsterra";
import { claimHilltop300, isHilltopBannersEnabled, releaseHilltop300 } from "../../lib/hilltop";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

export type CoverAdNetwork = "adsterra" | "hilltop";

export function useCoverAdNetwork(): CoverAdNetwork | null {
  const [net, setNet] = useState<CoverAdNetwork | null>(null);

  useEffect(() => {
    if (isBrowserSearchCrawler()) return;
    if (isAdsterraEnabled() && isAdsterraBannersEnabled() && claimAdsterraSize("300x250")) {
      setNet("adsterra");
      return () => releaseAdsterraSize("300x250");
    }
    if (isHilltopBannersEnabled() && claimHilltop300()) {
      setNet("hilltop");
      return () => releaseHilltop300();
    }
    setNet(null);
  }, []);

  return net;
}
