"use client";

import { useEffect } from "react";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";
import { getMonetagVignetteZone, MONETAG_VIGNETTE_SRC } from "../../lib/monetag";

export function MonetagVignette() {
  useEffect(() => {
    const zone = getMonetagVignetteZone();
    if (!zone || isBrowserSearchCrawler()) return;
    if (document.querySelector(`script[src*="vignette.min.js"][data-zone="${zone}"]`)) return;
    const script = document.createElement("script");
    script.src = MONETAG_VIGNETTE_SRC;
    script.dataset.zone = zone;
    script.dataset.cfasync = "false";
    document.body.appendChild(script);
  }, []);

  return null;
}
