type MediaType = "movie" | "tv";

/** TMDB ids removed after copyright notices. */
const BLOCKED_TITLES = new Set([
  "tv:129398", // The Sympathizer (2024) — OSN / GULF DTH FZ LLC
  "tv:244447", // The Hunting Wives (2025)
  "movie:672", // Harry Potter and the Chamber of Secrets (2002) — OSN
  "tv:1639", // Gossip Girl (2007) — OSN
]);

export function isBlockedTitle(type: MediaType, id: number): boolean {
  return BLOCKED_TITLES.has(`${type}:${id}`);
}

export function filterBlockedItems<T extends { type: MediaType; id: number }>(
  items: T[]
): T[] {
  return items.filter((item) => !isBlockedTitle(item.type, item.id));
}
