export type AgeCode = "7" | "13" | "17" | "18";

export function formatAgeBadge(code: AgeCode) {
  return `+${code}`;
}

export function ageBadgeClass(code: AgeCode) {
  if (code === "18") return "bg-red-600 text-white";
  if (code === "17") return "bg-orange-600 text-white";
  if (code === "13") return "bg-amber-500 text-white";
  return "bg-sky-600 text-white";
}

const TMDB_KEY = process.env.TMDB_API_KEY ?? "";
const BASE = "https://api.themoviedb.org/3";
const FETCH_OPTS = { next: { revalidate: 86400, tags: ["tmdb-age-jp"] } } as RequestInit;

/** Prefer Japan for anime, then US — do not take the strictest of every country. */
const COUNTRY_PREF = ["JP", "US", "GB", "DE", "FR", "KR", "AU", "CA", "BR", "NL", "AE", "SA", "EG"];

const AGE_RANK: Record<AgeCode, number> = { "7": 1, "13": 2, "17": 3, "18": 4 };

type ReleaseDateRow = { certification?: string; type?: number };
type MovieReleaseCountry = { iso_3166_1?: string; release_dates?: ReleaseDateRow[] };
type TvRatingCountry = { iso_3166_1?: string; rating?: string };

/**
 * Map official TMDB certifications to +7 / +13 / +17 / +18.
 * Unrated / unknown → null (never invent a number).
 */
export function mapTmdbCertification(raw: string | null | undefined): AgeCode | null {
  if (!raw?.trim()) return null;
  const c = raw
    .trim()
    .toUpperCase()
    .replace(/[_]/g, "-")
    .replace(/\s+/g, "");

  if (/^(NR|UR|UNRATED|NOTRATED|NOT-RATED)$/.test(c)) return null;

  if (
    /NC-?17|^X$|^XX$|^XXX$|ADULT|FSK18/.test(c) ||
    c.includes("R18") ||
    c.includes("R-18") ||
    c.includes("18+") ||
    c.includes("+18") ||
    c === "18" ||
    c === "18A" ||
    c === "-18" ||
    c === "C18" ||
    c === "19" ||
    c === "19+" ||
    c === "21" ||
    c === "III"
  ) {
    return "18";
  }

  if (c.startsWith("TV-MA") || c === "TVMA") return "17";
  if (c === "R" || c === "R+") return "17";
  if (
    c === "15" ||
    c === "15+" ||
    c === "16" ||
    c === "16+" ||
    c === "FSK16" ||
    c === "-16" ||
    c === "-15" ||
    c === "C16" ||
    c === "MA15+" ||
    c === "MA15" ||
    c.includes("R15") ||
    c.includes("R-15")
  ) {
    return "17";
  }

  if (c.includes("PG-13") || c === "PG13" || c === "TV-14" || c === "TV14") return "13";
  if (
    c === "12" ||
    c === "12+" ||
    c === "12A" ||
    c === "PG12" ||
    c === "PG-12" ||
    c === "FSK12" ||
    c === "-12" ||
    c === "13" ||
    c === "13+" ||
    c === "14" ||
    c === "14+" ||
    c === "M"
  ) {
    return "13";
  }

  if (
    c === "G" ||
    c === "PG" ||
    c === "U" ||
    c === "AL" ||
    c === "ALL" ||
    c === "0" ||
    c === "6" ||
    c === "TP" ||
    c === "L" ||
    c === "TV-G" ||
    c === "TVG" ||
    c === "TV-Y" ||
    c === "TVY" ||
    c === "TV-Y7" ||
    c === "TVY7" ||
    c === "TV-PG" ||
    c === "TVPG" ||
    c === "FSK0" ||
    c === "FSK6" ||
    c === "-6"
  ) {
    return "7";
  }

  return null;
}

function pickMovieCert(rows: ReleaseDateRow[] | undefined): string {
  if (!rows?.length) return "";
  let best: AgeCode | null = null;
  let bestRaw = "";
  for (const row of rows) {
    const cert = row.certification?.trim() || "";
    if (!cert) continue;
    const code = mapTmdbCertification(cert);
    if (!code) continue;
    if (!best || AGE_RANK[code] > AGE_RANK[best]) {
      best = code;
      bestRaw = cert;
    }
  }
  if (bestRaw) return bestRaw;
  const theatrical = rows.find((row) => row.type === 3 && row.certification?.trim());
  return theatrical?.certification?.trim() || rows.find((row) => row.certification?.trim())?.certification?.trim() || "";
}

function pickFromCountries(
  rows: Array<{ iso_3166_1?: string; cert: string }>
): AgeCode | null {
  const byCountry = new Map<string, string>();
  for (const row of rows) {
    const cc = (row.iso_3166_1 || "").toUpperCase();
    if (!cc || !row.cert) continue;
    if (!byCountry.has(cc)) byCountry.set(cc, row.cert);
  }

  const pref = COUNTRY_PREF;
  for (const cc of pref) {
    const code = mapTmdbCertification(byCountry.get(cc));
    if (code) return code;
  }

  let fallback: AgeCode | null = null;
  for (const cert of byCountry.values()) {
    const code = mapTmdbCertification(cert);
    if (!code) continue;
    if (code !== "18") return code;
    fallback = code;
  }
  return fallback;
}

export async function fetchTmdbAgeCode(
  type: "movie" | "tv",
  id: number
): Promise<AgeCode | null> {
  if (!TMDB_KEY || !Number.isFinite(id) || id <= 0) return null;
  try {
    if (type === "tv") {
      const res = await fetch(`${BASE}/tv/${id}/content_ratings?api_key=${TMDB_KEY}`, FETCH_OPTS);
      if (!res.ok) return null;
      const data = (await res.json()) as { results?: TvRatingCountry[] };
      return pickFromCountries(
        (data.results ?? []).map((row) => ({
          iso_3166_1: row.iso_3166_1,
          cert: row.rating?.trim() || "",
        }))
      );
    }

    const res = await fetch(`${BASE}/movie/${id}/release_dates?api_key=${TMDB_KEY}`, FETCH_OPTS);
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: MovieReleaseCountry[] };
    return pickFromCountries(
      (data.results ?? []).map((row) => ({
        iso_3166_1: row.iso_3166_1,
        cert: pickMovieCert(row.release_dates),
      }))
    );
  } catch {
    return null;
  }
}

export async function fetchTmdbAgeCodes(
  movies: number[],
  series: number[]
): Promise<{ movies: Record<string, AgeCode>; tv: Record<string, AgeCode> }> {
  const moviesOut: Record<string, AgeCode> = {};
  const tvOut: Record<string, AgeCode> = {};
  const movieIds = [...new Set(movies)].filter((id) => id > 0).slice(0, 80);
  const tvIds = [...new Set(series)].filter((id) => id > 0).slice(0, 80);

  async function run(ids: number[], type: "movie" | "tv", out: Record<string, AgeCode>) {
    const pending = [...ids];
    const workers = Array.from({ length: Math.min(5, pending.length) }, async () => {
      while (pending.length) {
        const id = pending.shift();
        if (!id) break;
        const code = await fetchTmdbAgeCode(type, id);
        if (code) out[String(id)] = code;
      }
    });
    await Promise.all(workers);
  }

  await Promise.all([run(movieIds, "movie", moviesOut), run(tvIds, "tv", tvOut)]);
  return { movies: moviesOut, tv: tvOut };
}
