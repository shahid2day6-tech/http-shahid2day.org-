/** Pinned Asian live-action titles. TMDB seasons/episodes share one show id. */

export type AsianTitle = { id: number; type: "tv" | "movie"; title: string };

function uniqueAsian(items: AsianTitle[]): AsianTitle[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const ASIAN_TV: AsianTitle[] = uniqueAsian([
  { id: 323579, type: "tv", title: "GATE24: The Border" },
  { id: 19416, type: "tv", title: "Iryu: Team Medical Dragon" },
  { id: 137870, type: "tv", title: "Love Like the Galaxy" },
]);

export const ASIAN_MOVIES: AsianTitle[] = uniqueAsian([]);
