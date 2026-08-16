"use client";

import { useEffect } from "react";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";
import { getMonetagTagZone, MONETAG_TAG_SRC } from "../../lib/monetag";

export function MonetagTag() {
  useEffect(() => {
    const zone = getMonetagTagZone();
    if (!zone || isBrowserSearchCrawler()) return;
    if (document.querySelector(`script[data-zone="${zone}"]`)) return;
    const script = document.createElement("script");
    script.src = MONETAG_TAG_SRC;
    script.async = true;
    script.dataset.zone = zone;
    script.dataset.cfasync = "false";
    document.head.appendChild(script);
  }, []);

  return null;
}
