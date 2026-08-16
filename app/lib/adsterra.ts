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

export const ADSTERRA_INVOKE_HOST = "https://www.highperformanceformat.com";

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
