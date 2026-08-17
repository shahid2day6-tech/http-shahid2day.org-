export type AdsterraBannerSize = "300x250" | "320x50" | "728x90";

const KEYS: Record<AdsterraBannerSize, string> = {
  "300x250": process.env.NEXT_PUBLIC_ADSTERRA_KEY_300x250?.trim() || "2fd48deba0e9934b28d3fbe589c1bc9a",
  "320x50": process.env.NEXT_PUBLIC_ADSTERRA_KEY_320x50?.trim() || "96f25a0fd91691ce08b284c998bdc350",
  "728x90": process.env.NEXT_PUBLIC_ADSTERRA_KEY_728x90?.trim() || "3eeb7a73eac54b142c0ab69c138747ae",
};

const DIM: Record<AdsterraBannerSize, { width: number; height: number }> = {
  "300x250": { width: 300, height: 250 },
  "320x50": { width: 320, height: 50 },
  "728x90": { width: 728, height: 90 },
};

/**
 * Sister CDNs first — www.highperformanceformat.com often returns empty
 * invoke.js so banners stay blank.
 */
export const ADSTERRA_INVOKE_HOSTS = [
  "https://www.effectivecreativeformat.com",
  "https://www.profitabledisplaynetwork.com",
  "https://pl30835301.highperformanceformat.com",
  "https://www.highperformanceformat.com",
] as const;

export const ADSTERRA_INVOKE_HOST = ADSTERRA_INVOKE_HOSTS[0];

export function buildAdsterraFrameHtml(size: AdsterraBannerSize, source = "s2d-adsterra"): string | null {
  const key = getAdsterraKey(size);
  if (!key) return null;
  const { width, height } = getAdsterraDims(size);
  const urls = ADSTERRA_INVOKE_HOSTS.map((host) => `${host}/${key}/invoke.js`);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta name="referrer" content="origin">
<style>
html,body{margin:0;padding:0;overflow:hidden;background:transparent;width:${width}px;height:${height}px}
</style>
</head>
<body>
<script type="text/javascript">
window.atOptions = {
  key: ${JSON.stringify(key)},
  format: "iframe",
  height: ${height},
  width: ${width},
  params: {}
};
atOptions = window.atOptions;
window.__adsterraInvokeUrls = ${JSON.stringify(urls)};
window.__adsterraInvokeIdx = 0;
window.__adsterraInvokeErr = function(el){
  window.__adsterraInvokeIdx += 1;
  var next = window.__adsterraInvokeUrls[window.__adsterraInvokeIdx];
  if (next) {
    el.onerror = function(){ window.__adsterraInvokeErr(el); };
    el.src = next;
  }
};
</script>
<script type="text/javascript" src="${urls[0]}" onerror="window.__adsterraInvokeErr(this)"></script>
<script type="text/javascript">
(function(){
  function notify(status){
    try { parent.postMessage({ source: ${JSON.stringify(source)}, size: ${JSON.stringify(size)}, status: status }, "*"); } catch (e) {}
  }
  function hasCreative(){
    var nodes = document.querySelectorAll("iframe, img, ins, a, video, canvas, object, embed");
    for (var i = 0; i < nodes.length; i++) {
      var r = nodes[i].getBoundingClientRect();
      if (r.width > 8 && r.height > 8) return true;
    }
    return false;
  }
  setTimeout(function(){ if (hasCreative()) notify("filled"); }, 1500);
  setTimeout(function(){ if (hasCreative()) notify("filled"); }, 4000);
  setTimeout(function(){ notify(hasCreative() ? "filled" : "empty"); }, 7000);
})();
</script>
</body>
</html>`;
}

export function isAdsterraEnabled() {
  const flag = process.env.NEXT_PUBLIC_ADSTERRA_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  return Boolean(KEYS["300x250"] || KEYS["320x50"] || KEYS["728x90"]);
}

export function isAdsterraBannersEnabled() {
  const flag = process.env.NEXT_PUBLIC_ADSTERRA_BANNERS?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  return isAdsterraEnabled();
}

export function getAdsterraKey(size: AdsterraBannerSize) {
  return KEYS[size];
}

export function getAdsterraDims(size: AdsterraBannerSize) {
  return DIM[size];
}

export function isAdsterraBannerSize(value: string): value is AdsterraBannerSize {
  return value === "300x250" || value === "320x50" || value === "728x90";
}

/** Adsterra allows one zone of each size per page. */
const claimedSizes = new Set<AdsterraBannerSize>();

export function claimAdsterraSize(size: AdsterraBannerSize) {
  if (claimedSizes.has(size)) return false;
  claimedSizes.add(size);
  return true;
}

export function releaseAdsterraSize(size: AdsterraBannerSize) {
  claimedSizes.delete(size);
}
