function hashSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 1-based indexes to insert an ad after. Stable per seed so SSR matches the client. */
export function pickRandomInsertAfter(
  cardCount: number,
  maxAds: number,
  every: number,
  seed: string,
): Set<number> {
  const out = new Set<number>();
  if (cardCount < 1 || maxAds < 1) return out;
  const rng = mulberry32(hashSeed(`${seed}:${cardCount}:${maxAds}:${every}`));
  const minGap = Math.max(3, Math.min(every, 5));
  const order = Array.from({ length: cardCount }, (_, i) => i + 1);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const current = order[i]!;
    order[i] = order[j]!;
    order[j] = current;
  }
  for (const pos of order) {
    if (out.size >= maxAds) break;
    if ([...out].some((placed) => Math.abs(placed - pos) < minGap)) continue;
    out.add(pos);
  }
  return out;
}
