"use client";

import type { AgeCode } from "./tmdbAge";

const movieCache = new Map<number, AgeCode>();
const tvCache = new Map<number, AgeCode>();
const movieWaiters = new Map<number, Set<() => void>>();
const tvWaiters = new Map<number, Set<() => void>>();
const movieQueue = new Set<number>();
const tvQueue = new Set<number>();
let flushTimer: number | null = null;

function cacheFor(type: "movie" | "tv") {
  return type === "tv" ? tvCache : movieCache;
}
function waitersFor(type: "movie" | "tv") {
  return type === "tv" ? tvWaiters : movieWaiters;
}

function notify(type: "movie" | "tv", id: number) {
  waitersFor(type).get(id)?.forEach((fn) => fn());
}

async function flushQueue() {
  flushTimer = null;
  const movies = [...movieQueue].filter((id) => !movieCache.has(id));
  const tv = [...tvQueue].filter((id) => !tvCache.has(id));
  movieQueue.clear();
  tvQueue.clear();
  if (!movies.length && !tv.length) return;

  const params = new URLSearchParams();
  if (movies.length) params.set("movies", movies.slice(0, 40).join(","));
  if (tv.length) params.set("tv", tv.slice(0, 40).join(","));
  try {
    const response = await fetch(`/api/tmdb/ages?${params.toString()}`);
    const payload = (await response.json()) as {
      movies?: Record<string, AgeCode>;
      tv?: Record<string, AgeCode>;
    };
    for (const id of movies) {
      movieCache.set(id, payload.movies?.[String(id)] ?? "13");
      notify("movie", id);
    }
    for (const id of tv) {
      tvCache.set(id, payload.tv?.[String(id)] ?? "13");
      notify("tv", id);
    }
  } catch {
    /* retry on next mount */
  }
}

function scheduleFlush() {
  if (flushTimer == null) {
    flushTimer = window.setTimeout(() => {
      void flushQueue();
    }, 80);
  }
}

export function peekTmdbAge(type: "movie" | "tv", id: number): AgeCode | undefined {
  return cacheFor(type).get(id);
}

export function subscribeTmdbAge(
  type: "movie" | "tv",
  id: number,
  listener: () => void
): () => void {
  const map = waitersFor(type);
  const set = map.get(id) ?? new Set<() => void>();
  set.add(listener);
  map.set(id, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) map.delete(id);
  };
}

export function enqueueTmdbAge(type: "movie" | "tv", id: number) {
  if (cacheFor(type).has(id)) return;
  const queue = type === "tv" ? tvQueue : movieQueue;
  if (queue.has(id)) return;
  queue.add(id);
  scheduleFlush();
}
