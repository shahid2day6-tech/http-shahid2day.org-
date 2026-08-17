"use client";

import { useEffect } from "react";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";
import { getMonetagVignetteZone, MONETAG_VIGNETTE_SRC } from "../../lib/monetag";

const CENTER_EVERY_MS = 10_000;

/** Official Monetag Vignette — center overlay, re-shown every 10 seconds. */
export function MonetagVignette() {
  useEffect(() => {
    const zone = getMonetagVignetteZone();
    if (!zone || isBrowserSearchCrawler()) return;

    function inject() {
      const existing = document.querySelector(
        `script[src*="vignette.min.js"][data-zone="${zone}"]`,
      );
      existing?.remove();
      const script = document.createElement("script");
      script.src = MONETAG_VIGNETTE_SRC;
      script.dataset.zone = zone;
      script.dataset.cfasync = "false";
      document.body.appendChild(script);
    }

    inject();
    const timer = window.setInterval(inject, CENTER_EVERY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
