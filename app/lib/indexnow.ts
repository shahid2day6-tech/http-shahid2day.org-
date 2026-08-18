import { SITE_URL } from "./site";

/** Public IndexNow key (must match the file in /public). */
export const INDEXNOW_KEY = "141f2ead4524320f21fe73ef86766a6178294da9";
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function canNotify(): boolean {
  if (process.env.VERCEL_ENV === "preview") return false;
  if (process.env.NEXT_PHASE === "phase-production-build") return false;
  return true;
}

/** Submit up to 10,000 URLs to IndexNow (Bing / Yandex / partners including Google). */
export async function submitIndexNow(urls: string[]): Promise<{ ok: boolean; submitted: number }> {
  const unique = [...new Set(urls.map((url) => url.trim()).filter((url) => url.startsWith("http")))];
  if (!canNotify() || unique.length === 0) return { ok: false, submitted: 0 };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: unique.slice(0, 10_000),
      }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    return { ok: res.ok || res.status === 202, submitted: unique.length };
  } catch {
    return { ok: false, submitted: 0 };
  }
}
