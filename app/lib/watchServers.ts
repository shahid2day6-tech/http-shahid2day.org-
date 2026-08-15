export type WatchServer = {
  name: string;
  label: string;
  recommended?: boolean;
  url: string;
};

function withLangParams(baseUrl: string, subLang: string): string {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}sub=${subLang}&sub_lang=${subLang}&ds_lang=${subLang}&lang=${subLang}&audio_lang=${subLang}`;
}

export function buildWatchServers(
  type: "movie" | "tv",
  id: string,
  season = 1,
  episode = 1,
  subLang = "ar"
): WatchServer[] {
  const lang = subLang === "en" ? "en" : "ar";
  const vidlink =
    type === "tv"
      ? `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=e50914&secondaryColor=111111&autoplay=true`
      : `https://vidlink.pro/movie/${id}?primaryColor=e50914&secondaryColor=111111&autoplay=true`;
  const vidsrcMe =
    type === "tv"
      ? `https://vidsrc.me/embed/tv/${id}/${season}/${episode}`
      : `https://vidsrc.me/embed/movie/${id}`;

  return [
    {
      name: "مترجم",
      label: "مترجم",
      recommended: true,
      url: withLangParams(vidlink, lang),
    },
    {
      name: "Shahid2Day",
      label: "Shahid2Day",
      url: withLangParams(vidsrcMe, lang),
    },
    {
      name: "MultiEmbed",
      label: "MultiEmbed",
      url:
        type === "tv"
          ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
          : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    },
    {
      name: "Videasy",
      label: "Videasy",
      url:
        type === "tv"
          ? `https://player.videasy.net/tv/${id}/${season}/${episode}?color=e50914`
          : `https://player.videasy.net/movie/${id}?color=e50914`,
    },
    {
      name: "Vidsharing",
      label: "Vidsharing",
      url:
        type === "tv"
          ? `https://1embed.cc/embed/tv/${id}/${season}/${episode}`
          : `https://1embed.cc/embed/movie/${id}`,
    },
  ];
}
