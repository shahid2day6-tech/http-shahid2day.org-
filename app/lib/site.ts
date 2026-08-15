export const SITE_NAME_AR = "شاهد تو داي";
export const SITE_NAME_EN = "SHAHID2DAY";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shahid2day.org"
).replace(/\/+$/, "");
export const SITE_LOGO = "/logo.png";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
