"use client";

import { useEffect } from "react";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";
import { getMonetagOnclickZone, MONETAG_ONCLICK_SRC } from "../../lib/monetag";

/** Official Monetag Onclick — fires on real clicks (covers, buttons, nav, servers). */
export function MonetagOnclick() {
  useEffect(() => {
    const zone = getMonetagOnclickZone();
    if (!zone || isBrowserSearchCrawler()) return;
    if (document.querySelector(`script[data-zone="${zone}"]`)) return;
    const script = document.createElement("script");
    script.src = MONETAG_ONCLICK_SRC;
    script.async = true;
    script.dataset.zone = zone;
    script.dataset.cfasync = "false";
    document.body.appendChild(script);
  }, []);

  return null;
}
