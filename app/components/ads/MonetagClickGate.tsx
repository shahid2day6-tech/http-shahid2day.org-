"use client";

import { useEffect } from "react";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";

const COOLDOWN_MS = 8000;
const STORAGE_KEY = "s2d-mt-click";
const SITE_CONTROL =
  "a, button, input, select, textarea, label, summary, [role='button'], [role='tab'], [role='link'], [data-no-mt]";

function lastFire() {
  const value = Number(sessionStorage.getItem(STORAGE_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function inCooldown() {
  return Date.now() - lastFire() < COOLDOWN_MS;
}

function isSiteControl(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(SITE_CONTROL));
}

/** Throttle Monetag onclick ads. Never delay site buttons, links, or server switches. */
export function MonetagClickGate() {
  useEffect(() => {
    if (isBrowserSearchCrawler()) return;

    const blockIfCooling = (event: Event) => {
      if (!inCooldown() || isSiteControl(event.target)) return;
      event.stopImmediatePropagation();
    };

    const markAllowedClick = () => {
      if (inCooldown()) return;
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
