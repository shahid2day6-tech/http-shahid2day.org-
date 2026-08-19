"use client";

import { useEffect } from "react";
import { isMonetagVignetteLayer } from "../../lib/monetagVignette";

const VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";

function isSiteShell(el: HTMLElement) {
  const tag = el.tagName;
  if (
    tag === "MAIN" ||
    tag === "NAV" ||
    tag === "FOOTER" ||
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "LINK" ||
    tag === "NOSCRIPT" ||
    tag === "NEXT-ROUTE-ANNOUNCER"
  ) {
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

/** Never resize real site UI even if an ad script wraps/siblings oddly. */
function looksLikeSiteContent(el: HTMLElement) {
  if (isSiteShell(el)) return true;
  if (el.querySelector("main, nav, footer, [data-site-root], [data-site-chrome], [data-site-ui]")) {
    return true;
  }
  if (el.querySelector("a[href^='/watch'], a[href^='/movie'], a[href^='/tv'], a[href='/']")) {
    return true;
  }
  // Homepage rails / posters
  if (el.querySelectorAll("img").length >= 4) return true;
  return false;
}

function hasAdBadge(root: HTMLElement) {
  const stack: HTMLElement[] = [root];
  let steps = 0;
  while (stack.length && steps < 80) {
    steps += 1;
    const el = stack.pop();
    if (!el) continue;
    const text = (el.textContent || "").trim();
    if (text === "Ad" || text === "AD" || text === "Advertisement") {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.width <= 72 && rect.height <= 36) return true;
    }
    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement) stack.push(child);
    }
  }
  return false;
}

function hasAdIframe(el: HTMLElement) {
  for (const iframe of Array.from(el.querySelectorAll("iframe"))) {
    const src = `${iframe.getAttribute("src") || ""} ${iframe.getAttribute("data-src") || ""}`;
    if (/ads|doubleclick|googlesyndication|exoclick|monetag|hilltop|adsterra|quge5|profitablerate/i.test(src)) {
      return true;
    }
  }
  return false;
}

function looksLikeInjectedAd(el: HTMLElement) {
  if (looksLikeSiteContent(el)) return false;
  if (el.dataset.mvPinned === "1") return true;
  if (hasAdBadge(el) || hasAdIframe(el)) return true;
  const idClass = `${el.id} ${el.className}`.toLowerCase();
  if (/monetag|ad-container|adsbox|adsbygoogle|sponsor/.test(idClass)) return true;
  return false;
}

function lockViewport() {
  let meta = document.querySelector('meta[name="viewport"]');
  if (!(meta instanceof HTMLMetaElement)) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    document.head.appendChild(meta);
  }
  if (meta.getAttribute("content") !== VIEWPORT) {
    meta.setAttribute("content", VIEWPORT);
  }

  const html = document.documentElement;
  const body = document.body;
  // Prefer hidden over clip — clip + dir=rtl still lets some WebViews widen scrollWidth.
  html.style.setProperty("overflow-x", "hidden", "important");
  body.style.setProperty("overflow-x", "hidden", "important");
  html.style.setProperty("max-width", "100%", "important");
  body.style.setProperty("max-width", "100%", "important");
  html.style.setProperty("width", "100%", "important");
  body.style.setProperty("width", "100%", "important");
  html.style.removeProperty("zoom");
  body.style.removeProperty("zoom");
  html.style.removeProperty("transform");
  body.style.removeProperty("transform");
  // Kill accidental horizontal scroll after RTL language switch.
  html.scrollLeft = 0;
  body.scrollLeft = 0;
}

function unpinIfSiteShell(node: HTMLElement) {
  if (!looksLikeSiteContent(node) && !isSiteShell(node)) return false;
  if (node.dataset.mvPinned === "1") delete node.dataset.mvPinned;
  for (const prop of [
    "position",
    "inset",
    "top",
    "right",
    "left",
    "bottom",
    "width",
    "max-width",
    "height",
    "max-height",
    "transform",
    "z-index",
  ]) {
    node.style.removeProperty(prop);
  }
  return true;
}

function pinWidthPx() {
  const vw = Math.min(window.innerWidth || 320, document.documentElement.clientWidth || 320);
  return Math.max(160, Math.min(300, vw - 16));
}

function belowHeroHost(): HTMLElement | null {
  const el = document.querySelector("[data-mv-ad-below-hero='1']");
  return el instanceof HTMLElement ? el : null;
}

function enableAdClicks(node: HTMLElement) {
  for (const child of Array.from(node.querySelectorAll("a, button, iframe, img"))) {
    if (child instanceof HTMLElement) {
      child.style.setProperty("pointer-events", "auto", "important");
    }
  }
}

function pinIntoBelowHero(node: HTMLElement) {
  const host = belowHeroHost();
  if (!host) return false;
  if (node.parentElement !== host) host.appendChild(node);
  const maxW = pinWidthPx();
  node.style.setProperty("position", "relative", "important");
  node.style.setProperty("inset", "auto", "important");
  node.style.setProperty("top", "auto", "important");
  node.style.setProperty("right", "auto", "important");
  node.style.setProperty("left", "auto", "important");
  node.style.setProperty("bottom", "auto", "important");
  node.style.setProperty("width", `${maxW}px`, "important");
  node.style.setProperty("max-width", `${maxW}px`, "important");
  node.style.setProperty("height", "auto", "important");
  node.style.setProperty("max-height", "40vh", "important");
  node.style.setProperty("overflow", "hidden", "important");
  node.style.setProperty("transform", "none", "important");
  node.style.setProperty("margin", "0 0 8px auto", "important");
  node.style.setProperty("z-index", "1", "important");
  node.dataset.mvPinned = "1";
  enableAdClicks(node);
  return true;
}

function pinAdToCorner(node: HTMLElement) {
  if (unpinIfSiteShell(node)) return;
  if (pinIntoBelowHero(node)) return;

  const maxW = pinWidthPx();
  const hero = document.querySelector("[data-site-hero='1']");
  const top =
    hero instanceof HTMLElement
      ? Math.max(8, Math.round(hero.getBoundingClientRect().bottom + 8))
      : 72;

  node.style.setProperty("position", "fixed", "important");
  node.style.setProperty("inset", "auto", "important");
  node.style.setProperty("top", `${top}px`, "important");
  // Physical right corner — avoids 100vw overflow under dir=rtl.
  node.style.setProperty("right", "8px", "important");
  node.style.setProperty("left", "auto", "important");
  node.style.setProperty("width", `${maxW}px`, "important");
  node.style.setProperty("max-width", `${maxW}px`, "important");
  node.style.setProperty("height", "auto", "important");
  node.style.setProperty("max-height", "40vh", "important");
  node.style.setProperty("overflow", "hidden", "important");
  node.style.setProperty("transform", "none", "important");
  node.style.setProperty("z-index", "40", "important");
  node.dataset.mvPinned = "1";
  enableAdClicks(node);
}

function containInjectedAds() {
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  for (const node of Array.from(document.body.children)) {
    if (!(node instanceof HTMLElement) || isSiteShell(node)) continue;
    if (looksLikeSiteContent(node)) continue;
    if (isMonetagVignetteLayer(node)) continue;
    if (!looksLikeInjectedAd(node)) continue;

    const rect = node.getBoundingClientRect();
    const coversViewport =
      rect.width >= vw * 0.55 &&
      rect.height >= vh * 0.35 &&
      rect.top <= Math.max(80, vh * 0.2);

    // Huge empty "AD" placeholders — collapse instead of leaving a blank slab.
    const mostlyEmpty = rect.height >= vh * 0.35 && node.querySelectorAll("iframe, img, video").length === 0;
    if (mostlyEmpty && hasAdBadge(node)) {
      node.style.setProperty("display", "none", "important");
      continue;
    }

    if (coversViewport || node.dataset.mvPinned === "1") {
      pinAdToCorner(node);
    }
  }
}

/** Stops ad overlays from expanding the page and stealing taps on mobile. */
export function AdChromeGuard() {
  useEffect(() => {
    let timer = 0;
    let running = false;
    const run = () => {
      if (running) return;
      running = true;
      try {
        lockViewport();
        containInjectedAds();
      } finally {
        running = false;
      }
    };
    const schedule = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        run();
      }, 80);
    };

    run();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    observer.observe(document.head, { childList: true, subtree: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, []);

  return null;
}
