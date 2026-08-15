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
      ? `https://vsembed.su/embed/tv/${id}/${season}/${episode}`
      : `https://vsembed.su/embed/movie/${id}`;

  return [{ name: "EarnVids", label: "EarnVids", url }];
}
