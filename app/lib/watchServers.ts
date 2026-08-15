export type WatchServer = {
  name: string;
  label: string;
  recommended?: boolean;
  url: string;
};

export function buildWatchServers(
  type: "movie" | "tv",
  id: string,
  season = 1,
  episode = 1
): WatchServer[] {
  const url =
    type === "tv"
      ? `https://player.videasy.net/tv/${id}/${season}/${episode}?color=e50914&overlay=false`
      : `https://player.videasy.net/movie/${id}?color=e50914&overlay=false`;

  return [{ name: "مترجم 1", label: "مترجم 1", recommended: true, url }];
}
