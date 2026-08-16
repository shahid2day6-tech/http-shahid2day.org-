/** Detects uBlock, AdBlock, AdGuard — same signals as MovieVault / Watch Clash Anime. */

declare global {
  interface Window {
    __S2D_AD_OK?: number;
    __S2D_ADV_OK?: number;
  }
}

const BAIT_CLASS =
  "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links adsbox adsbygoogle advertisement ad-banner ad-placement sponsored";

const GOOGLE_ADS_JS = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
const DOUBLECLICK_JS = "https://static.doubleclick.net/instream/ad_status.js";
const ADSTERRA_PROBE_JS = "https://www.highperformanceformat.com/";

/** Touch tablets often hide EasyList bait via built-in shields (not an extension). */
function isTouchPrimaryDevice() {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.matchMedia("(pointer: coarse)").matches &&
      window.matchMedia("(hover: none)").matches
    );
  } catch {
    return navigator.maxTouchPoints > 1 && window.innerWidth < 1100;
  }
}

function baitLooksBlocked(node: HTMLElement) {
  if (!node.isConnected) return true;
  const style = window.getComputedStyle(node);
  if (style.display === "none" || style.visibility === "hidden") return true;
  if (Number.parseFloat(style.opacity || "1") === 0) return true;
  if (style.height === "0px" || style.maxHeight === "0px") return true;
  if (node.offsetHeight < 10) return true;
  return false;
}

function mountBait() {
  const node = document.createElement("div");
  node.className = BAIT_CLASS;
  node.setAttribute("aria-hidden", "true");
  node.style.cssText =
    "position:absolute;left:-10000px;top:0;width:300px;height:250px;pointer-events:none;";
  node.innerHTML = "&nbsp;";
  document.body.appendChild(node);

  const ins = document.createElement("ins");
  ins.className = "adsbygoogle";
  ins.setAttribute("aria-hidden", "true");
  ins.style.cssText =
    "display:block;position:absolute;left:-10000px;top:0;width:300px;height:250px;";
  document.body.appendChild(ins);

  return { node, ins };
}

function loadFlagScript(src: string, flag: "__S2D_AD_OK" | "__S2D_ADV_OK") {
  return new Promise<boolean>((resolve) => {
    window[flag] = 0;
    const script = document.createElement("script");
    script.src = `${src}?t=${Date.now()}`;
    script.async = true;
    let settled = false;
    const done = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      script.onload = null;
      script.onerror = null;
      script.remove();
      resolve(blocked);
    };
    script.onload = () => done(window[flag] !== 1);
    script.onerror = () => done(true);
    document.head.appendChild(script);
    window.setTimeout(() => done(window[flag] !== 1), 2000);
  });
}

function loadRemoteScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = `${src}${src.includes("?") ? "&" : "?"}s2d=${Date.now()}`;
    script.async = true;
    let settled = false;
    const done = (blocked: boolean) => {
      if (settled) return;
      settled = true;
      script.onload = null;
      script.onerror = null;
      script.remove();
      resolve(blocked);
    };
    script.onload = () => done(false);
    script.onerror = () => done(true);
    document.head.appendChild(script);
    window.setTimeout(() => done(true), 2500);
  });
}

function fetchLooksBlocked(url: string) {
  return fetch(url, { method: "GET", mode: "no-cors", cache: "no-store", credentials: "omit" }).then(
    () => false,
    () => true,
  );
}

/**
 * Desktop: bait OR local probes OR ≥2 remote trackers down → lock.
 * Touch tablets/phones: only lock if both /ads.js and /advertisement.js fail.
 */
export async function detectAdBlock(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const touch = isTouchPrimaryDevice();
  const { node, ins } = mountBait();
  await new Promise((r) => window.setTimeout(r, 80));
  const baitBlocked = baitLooksBlocked(node) || baitLooksBlocked(ins);

  const [adsJs, advertisementJs, googleAds, doubleClick, adsterraNet] = await Promise.all([
    loadFlagScript("/ads.js", "__S2D_AD_OK"),
    loadFlagScript("/advertisement.js", "__S2D_ADV_OK"),
    touch ? Promise.resolve(false) : loadRemoteScript(GOOGLE_ADS_JS),
    touch ? Promise.resolve(false) : loadRemoteScript(DOUBLECLICK_JS),
    touch ? Promise.resolve(false) : fetchLooksBlocked(ADSTERRA_PROBE_JS),
  ]);

  await new Promise((r) => window.setTimeout(r, 300));
  const baitBlockedLate = baitLooksBlocked(node) || baitLooksBlocked(ins);
  node.remove();
  ins.remove();

  if (touch) {
    return Boolean(adsJs && advertisementJs);
  }

  const trackersDown = [googleAds, doubleClick, adsterraNet].filter(Boolean).length >= 2;
  return Boolean(baitBlocked || baitBlockedLate || adsJs || advertisementJs || trackersDown);
}
