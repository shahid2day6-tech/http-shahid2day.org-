export type AgeCode = "13" | "17" | "18";

export function formatAgeBadge(code: AgeCode) {
  return `+${code}`;
}

export function ageBadgeClass(code: AgeCode) {
  if (code === "18") return "bg-red-600 text-white";
  if (code === "17") return "bg-orange-600 text-white";
  return "bg-amber-500 text-white";
}

const TMDB_KEY = process.env.TMDB_API_KEY ?? "";
const BASE = "https://api.themoviedb.org/3";
const FETCH_OPTS = { next: { revalidate: 604800, tags: ["tmdb-age"] } } as RequestInit;

/** Prefer widely used theatrical/TV boards, then regional. */
const COUNTRY_PREF = ["US", "GB", "DE", "FR", "CA", "AU", "NL", "BR", "AE", "SA", "EG"];

type ReleaseDateRow = { certification?: string; type?: number };
type MovieReleaseCountry = { iso_3166_1?: string; release_dates?: ReleaseDateRow[] };
type TvRatingCountry = { iso_3166_1?: string; rating?: string };

/**
 * Map official TMDB certifications (MPAA, BBFC, FSK, etc.) to +13 / +17 / +18.
 * Unrated / kids titles return null — we do not invent a number.
 */
export function mapTmdbCertification(raw: string | null | undefined): AgeCode | null {
  if (!raw?.trim()) return null;
  const c = raw
    .trim()
    .toUpperCase()
    .replace(/[_]/g, "-")
    .replace(/\s+/g, "");

  if (
    /NC-?17|R-?18|18\+|18A|\+18|^18$|XXX|^X$|TV-MA-L|ADULT/.test(c)
  ) {
    return "18";
  }

  if (c === "TV-MA" || c === "TVMA" || c === "R") return "17";
  if (c === "15" || c === "15+" || c === "16" || c === "16+" || c === "FSK16" || c === "-16") return "17";

  if (c.includes("PG-13") || c === "PG13" || c === "TV-14" || c === "TV14") return "13";
  if (
    c === "12" ||
    c === "12+" ||
    c === "12A" ||
    c === "FSK12" ||
    c === "-12" ||
    c === "13" ||
    c === "13+" ||
    c === "14" ||
    c === "14+"
  ) {
    return "13";
  }

  return null;
}

function pickMovieCert(rows: ReleaseDateRow[] | undefined): string {
  if (!rows?.length) return "";
  const theatrical = rows.find((row) => row.type === 3 && row.certification?.trim());
  if (theatrical?.certification) return theatrical.certification;
  const any = rows.find((row) => row.certification?.trim());
  return any?.certification?.trim() || "";
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
  for (const cc of COUNTRY_PREF) {
    const code = mapTmdbCertification(byCountry.get(cc));
    if (code) return code;
  }
  for (const cert of byCountry.values()) {
    const code = mapTmdbCertification(cert);
    if (code) return code;
  }
  return null;
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
  const movieIds = [...new Set(movies)].filter((id) => id > 0).slice(0, 40);
  const tvIds = [...new Set(series)].filter((id) => id > 0).slice(0, 40);

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
