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
  const vidlink =
    type === "tv"
      ? `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=e50914&secondaryColor=111111&autoplay=true`
      : `https://vidlink.pro/movie/${id}?primaryColor=e50914&secondaryColor=111111&autoplay=true`;
  const twoEmbed =
    type === "tv"
      ? `https://www.2embed.cc/embedtv/${id}?s=${season}&e=${episode}`
      : `https://www.2embed.cc/embed/${id}`;
  const vidsharing =
    type === "tv"
      ? `https://1embed.cc/embed/tv/${id}/${season}/${episode}`
      : `https://1embed.cc/embed/movie/${id}`;

  return [
    {
      name: "Shahid2Day",
      label: "Shahid2Day",
      url:
        type === "tv"
          ? `https://vidsrc.me/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.me/embed/movie/${id}`,
    },
    {
      name: "2Embed",
      label: "2Embed",
      url: twoEmbed,
    },
    {
      name: "VidSrc",
      label: "VidSrc",
      url:
        type === "tv"
          ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.to/embed/movie/${id}`,
    },
    {
      name: "Vidعربي",
      label: "Vidعربي",
      recommended: true,
      url: withLangParams(vidlink, "ar"),
    },
    {
      name: "VidLink",
      label: "VidLink",
      url: withLangParams(vidlink, subLang),
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
      name: "AutoEmbed",
      label: "AutoEmbed",
      url:
        type === "tv"
          ? `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`
          : `https://player.autoembed.cc/embed/movie/${id}`,
    },
    {
      name: "Videasy",
      label: "Videasy",
      url:
        type === "tv"
          ? `https://player.videasy.to/tv/${id}/${season}/${episode}`
          : `https://player.videasy.to/movie/${id}`,
    },
    {
      name: "Vidsharing",
      label: "Vidsharing",
      url: vidsharing,
    },
  ];
}
