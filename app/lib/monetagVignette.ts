/** Monetag Vignette (n6wxm) — center overlay. Do not pin like In-Page Push. */

export function isMonetagVignetteLayer(el: HTMLElement): boolean {
  const blob = `${el.id} ${el.className}`.toLowerCase();
  if (/n6wxm|vignette/.test(blob)) return true;
  for (const node of el.querySelectorAll("iframe, script")) {
    if (/n6wxm\.com|vignette\.min\.js/i.test(node.getAttribute("src") || "")) return true;
  }
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.width >= vw * 0.8 && r.height >= vh * 0.65 && r.top <= 24 && r.left <= 24;
}

export function isCenteredVignetteCard(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 180 || r.height < 80) return false;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return Math.abs(cx - vw / 2) < vw * 0.22 && Math.abs(cy - vh / 2) < vh * 0.28;
}

export function isInsideMonetagVignette(el: HTMLElement): boolean {
  let n: HTMLElement | null = el;
  for (let i = 0; i < 8 && n; i += 1) {
    if (isMonetagVignetteLayer(n) || isCenteredVignetteCard(n)) return true;
    n = n.parentElement;
  }
  return false;
}
