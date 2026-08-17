"use client";

import { useEffect, useState } from "react";
import { claimHilltop300, isHilltopBannersEnabled, releaseHilltop300 } from "../../lib/hilltop";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

export type CoverAdNetwork = "adsterra" | "hilltop";

/** Poster covers use Hilltop. Adsterra 300×250 stays in dedicated in-flow slots. */
export function useCoverAdNetwork(): CoverAdNetwork | null {
  const [net, setNet] = useState<CoverAdNetwork | null>(null);

  useEffect(() => {
    if (isBrowserSearchCrawler()) return;
    if (isHilltopBannersEnabled() && claimHilltop300()) {
      setNet("hilltop");
      return () => releaseHilltop300();
    }
    setNet(null);
  }, []);

  return net;
}
