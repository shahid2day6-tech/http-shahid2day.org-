"use client";

import { useEffect, useState } from "react";
import type { AgeCode } from "./tmdbAge";
import { enqueueTmdbAge, peekTmdbAge, subscribeTmdbAge } from "./tmdbAgeClientCache";

export function useTmdbAgeCode(
  type: "movie" | "tv" | null | undefined,
  id: number | null | undefined
): AgeCode | null {
  const tmdbId = Math.floor(Number(id));
  const media = type === "tv" ? "tv" : type === "movie" ? "movie" : null;
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!media || !Number.isFinite(tmdbId) || tmdbId <= 0) return;
    if (peekTmdbAge(media, tmdbId) !== undefined) return;
    const unsub = subscribeTmdbAge(media, tmdbId, () => setTick((value) => value + 1));
    enqueueTmdbAge(media, tmdbId);
    return unsub;
  }, [media, tmdbId]);

  if (!media || !Number.isFinite(tmdbId) || tmdbId <= 0) return null;
  return peekTmdbAge(media, tmdbId) ?? null;
}
