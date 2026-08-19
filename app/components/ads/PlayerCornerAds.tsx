"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isBrowserSearchCrawler } from "../../lib/isSearchCrawler";
import { isInsideMonetagVignette } from "../../lib/monetagVignette";

function isWatchPath(pathname: string) {
  return pathname.startsWith("/watch");
}

function isAppShell(el: HTMLElement) {
  const tag = el.tagName;
  if (tag === "MAIN" || tag === "FOOTER" || tag === "NAV" || tag === "SCRIPT" || tag === "STYLE" || tag === "LINK") {
    return true;
  }
  return Boolean(
    el.dataset.siteChrome ||
      el.dataset.siteRoot ||
      el.dataset.siteUi ||
      el.dataset.mvPlayer ||
      el.dataset.mvAdCorner ||
      el.dataset.mvAdBelowHero,
  );
}

function isTmdbMedia(el: HTMLElement) {
  if (el.tagName === "IMG") {
    const src = `${el.getAttribute("src") || ""} ${el.getAttribute("srcset") || ""}`;
    if (/tmdb|themoviedb/i.test(src)) return true;
  }
  return Boolean(
    el.querySelector("img[src*='image.tmdb.org'], img[src*='themoviedb'], a[href*='/watch']"),
  );
}

function hasAdBadge(root: HTMLElement) {
  const stack: HTMLElement[] = [root];
  let steps = 0;
  while (stack.length && steps < 100) {
    steps += 1;
    const el = stack.pop();
    if (!el) continue;
    if ((el.textContent || "").trim() === "Ad") {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.width <= 56 && rect.height <= 32) return true;
    }
    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement) stack.push(child);
    }
  }
  return false;
}

function isMonetagWidget(el: HTMLElement) {
  if (el.dataset.mvPinned === "1") return true;
  if (isInsideMonetagVignette(el)) return false;
  if (isAppShell(el) || isTmdbMedia(el)) return false;
  if (el.querySelector("main, nav, footer, [data-site-root], [data-site-chrome], a[href^='/watch']")) {
    return false;
  }
  if (!hasAdBadge(el)) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 150 || r.width > 480) return false;
  if (r.height < 40 || r.height > 360) return false;
  if (r.height > r.width * 1.2) return false;
  return true;
}

function walkInjected(root: HTMLElement, visit: (el: HTMLElement) => void) {
  const stack: HTMLElement[] = [root];
  let steps = 0;
  while (stack.length && steps < 200) {
    steps += 1;
    const el = stack.pop();
    if (!el) continue;
    visit(el);
    if (el.shadowRoot) {
      for (const child of Array.from(el.shadowRoot.children)) {
        if (child instanceof HTMLElement) stack.push(child);
      }
    }
    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement) stack.push(child);
    }
  }
}

function belowHeroHost(): HTMLElement | null {
  const el = document.querySelector("[data-mv-ad-below-hero='1']");
  return el instanceof HTMLElement ? el : null;
}

function collectWidgets(): HTMLElement[] {
  const found: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();
  const add = (el: HTMLElement) => {
    if (seen.has(el) || isTmdbMedia(el) || isAppShell(el)) return;
    seen.add(el);
    found.push(el);
  };

  for (const node of Array.from(document.querySelectorAll("[data-mv-pinned='1']"))) {
    if (node instanceof HTMLElement) add(node);
  }

  const host = belowHeroHost();
  if (host) {
    walkInjected(host, (el) => {
      if (isMonetagWidget(el)) add(el);
    });
  }

  for (const node of Array.from(document.body.children)) {
    if (!(node instanceof HTMLElement) || isAppShell(node)) continue;
    walkInjected(node, (el) => {
      if (isMonetagWidget(el)) add(el);
    });
  }

  return found
    .filter((el) => !found.some((other) => other !== el && other.contains(el)))
    .slice(0, 2);
}

function cornerHost(): HTMLElement | null {
  const el = document.querySelector("[data-mv-ad-corner='1']");
  return el instanceof HTMLElement ? el : null;
}

function pinWidthPx() {
  const vw = Math.min(window.innerWidth || 320, document.documentElement.clientWidth || 320);
  return Math.max(160, Math.min(300, vw - 16));
}

function offsetBelowNav(el: HTMLElement) {
  const nav = document.querySelector("[data-site-chrome]");
  const navH = nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 64;
  const top = Math.max(8, Math.round(navH + 8));
  const maxW = pinWidthPx();
  el.style.setProperty("position", "fixed", "important");
  el.style.setProperty("top", `${top}px`, "important");
  el.style.setProperty("right", "8px", "important");
  el.style.setProperty("left", "auto", "important");
  el.style.setProperty("bottom", "auto", "important");
  el.style.setProperty("inset", "auto", "important");
  el.style.setProperty("transform", "none", "important");
  el.style.setProperty("width", `${maxW}px`, "important");
  el.style.setProperty("max-width", `${maxW}px`, "important");
  el.style.setProperty("z-index", "40", "important");
  el.dataset.mvPinned = "1";
}

function pinToCorner(el: HTMLElement) {
  const host = cornerHost();
  if (!host) return false;
  if (el.parentElement !== host) host.appendChild(el);
  el.style.setProperty("position", "relative", "important");
  el.style.setProperty("left", "auto", "important");
  el.style.setProperty("right", "auto", "important");
  el.style.setProperty("top", "auto", "important");
  el.style.setProperty("bottom", "auto", "important");
  el.style.setProperty("inset", "auto", "important");
  el.style.setProperty("transform", "none", "important");
  el.style.setProperty("margin", "0", "important");
  el.style.setProperty("z-index", "1", "important");
  el.style.setProperty("pointer-events", "auto", "important");
  el.style.setProperty("max-width", "100%", "important");
  el.dataset.mvPinned = "1";
  return true;
}

function pinBelowHero(el: HTMLElement) {
  const host = belowHeroHost();
  if (!host) return false;
  if (el.parentElement !== host) host.appendChild(el);
  const maxW = pinWidthPx();
  el.style.setProperty("position", "relative", "important");
  el.style.setProperty("left", "auto", "important");
  el.style.setProperty("right", "auto", "important");
  el.style.setProperty("top", "auto", "important");
  el.style.setProperty("bottom", "auto", "important");
  el.style.setProperty("inset", "auto", "important");
  el.style.setProperty("transform", "none", "important");
  el.style.setProperty("margin", "0 0 8px auto", "important");
  el.style.setProperty("width", `${maxW}px`, "important");
  el.style.setProperty("max-width", `${maxW}px`, "important");
  el.style.setProperty("z-index", "1", "important");
  el.style.setProperty("pointer-events", "auto", "important");
  el.dataset.mvPinned = "1";
  return true;
}

function offsetBelowHero(el: HTMLElement) {
  const hero = document.querySelector("[data-site-hero='1']");
  if (!(hero instanceof HTMLElement)) return false;
  const top = Math.max(8, Math.round(hero.getBoundingClientRect().bottom + 8));
  const maxW = pinWidthPx();
  el.style.setProperty("position", "fixed", "important");
  el.style.setProperty("top", `${top}px`, "important");
  el.style.setProperty("right", "8px", "important");
  el.style.setProperty("left", "auto", "important");
  el.style.setProperty("bottom", "auto", "important");
  el.style.setProperty("inset", "auto", "important");
  el.style.setProperty("transform", "none", "important");
  el.style.setProperty("width", `${maxW}px`, "important");
  el.style.setProperty("max-width", `${maxW}px`, "important");
  el.style.setProperty("z-index", "40", "important");
  el.dataset.mvPinned = "1";
  return true;
}

/** Pins Monetag in-page push below the hero cover, or into the watch player corner. */
export function PlayerCornerAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (isBrowserSearchCrawler()) return;

    let frame = 0;
    let moving = false;
    const run = () => {
      frame = 0;
      if (moving) return;
      moving = true;
      try {
        const onWatch = isWatchPath(pathname);
        collectWidgets().forEach((el) => {
          if (onWatch && pinToCorner(el)) return;
          if (pinBelowHero(el)) return;
          if (offsetBelowHero(el)) return;
          offsetBelowNav(el);
        });
      } finally {
        moving = false;
      }
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(run);
    };

    run();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}

export function PlayerAdCorner() {
  return (
    <div
      data-mv-ad-corner="1"
      className="pointer-events-none absolute top-2 right-2 z-[60] flex w-[min(320px,calc(100%-1rem))] flex-col gap-2"
    />
  );
}
