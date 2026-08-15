export const SITE_NAME_AR = "شاهد لليوم";
export const SITE_NAME_EN = "Shahid2Day";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shahid2day.org"
).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
