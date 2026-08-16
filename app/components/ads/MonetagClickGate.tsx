"use client";

import { useEffect } from "react";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

const COOLDOWN_MS = 8000;
const STORAGE_KEY = "s2d-mt-click";

function lastFire() {
  const value = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function inCooldown() {
  return Date.now() - lastFire() < COOLDOWN_MS;
}

/** Allow one Monetag click-ad every 8 seconds. Site buttons and links still work. */
export function MonetagClickGate() {
  useEffect(() => {
    if (isBrowserSearchCrawler()) return;

    const blockIfCooling = (event: Event) => {
      if (inCooldown()) event.stopImmediatePropagation();
    };

    const markAllowedClick = (event: Event) => {
      if (inCooldown()) {
        event.stopImmediatePropagation();
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
    };

    document.addEventListener("click", blockIfCooling, true);
    document.addEventListener("click", markAllowedClick, false);
    return () => {
      document.removeEventListener("click", blockIfCooling, true);
      document.removeEventListener("click", markAllowedClick, false);
    };
  }, []);

  return null;
}
