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
  episode = 1,
  subLang = "ar"
): WatchServer[] {
  const s = season;
  const e = episode;
  const lang = subLang === "en" ? "en" : "ar";
  const videasy =
    type === "tv"
      ? `https://player.videasy.net/tv/${id}/${s}/${e}?color=e50914&overlay=false`
      : `https://player.videasy.net/movie/${id}?color=e50914&overlay=false`;
  const vidlink =
    type === "tv"
      ? `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=e50914&secondaryColor=111111&autoplay=true&sub=${lang}&ds_lang=${lang}`
      : `https://vidlink.pro/movie/${id}?primaryColor=e50914&secondaryColor=111111&autoplay=true&sub=${lang}&ds_lang=${lang}`;
  const vidsrcCc =
    type === "tv"
      ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}?autoPlay=true`
      : `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`;
  const vidsrcXyz =
    type === "tv"
      ? `https://vidsrc.xyz/embed/tv/${id}/${s}-${e}`
      : `https://vidsrc.xyz/embed/movie/${id}`;
  const embedSu =
    type === "tv"
      ? `https://embed.su/embed/tv/${id}/${s}/${e}`
      : `https://embed.su/embed/movie/${id}`;
  const multiembed =
    type === "tv"
      ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
      : `https://multiembed.mov/?video_id=${id}&tmdb=1`;

  return [
    { name: "مترجم 1", label: "مترجم 1", recommended: true, url: videasy },
    { name: "مترجم 2", label: "مترجم 2", url: vidlink },
    { name: "مترجم 3", label: "مترجم 3", url: vidsrcCc },
    { name: "مترجم 4", label: "مترجم 4", url: vidsrcXyz },
    { name: "مترجم 5", label: "مترجم 5", url: embedSu },
    { name: "مترجم 6", label: "مترجم 6", url: multiembed },
  ];
}
