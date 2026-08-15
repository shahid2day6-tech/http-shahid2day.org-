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
  const vidlink =
    type === "tv"
      ? `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=e50914&secondaryColor=111111&autoplay=true`
      : `https://vidlink.pro/movie/${id}?primaryColor=e50914&secondaryColor=111111&autoplay=true`;

  return [
    {
      name: "Smashy",
      label: "Smashy",
      recommended: true,
      url:
        type === "tv"
          ? `https://player.smashy.stream/tv/${id}?s=${season}&e=${episode}&subLang=Arabic`
          : `https://player.smashy.stream/movie/${id}?subLang=Arabic`,
    },
    {
      name: "VidLink1",
      label: "VidLink1",
      url:
        type === "tv"
          ? `https://vidsrc.me/embed/tv/${id}/${season}/${episode}?ds_lang=ar`
          : `https://vidsrc.me/embed/movie/${id}?ds_lang=ar`,
    },
    {
      name: "VidCC",
      label: "VidCC",
      url:
        type === "tv"
          ? `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=true&ds_lang=ar`
          : `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true&ds_lang=ar`,
    },
    {
      name: "VidLink",
      label: "VidLink",
      url: vidlink,
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
    {
      name: "Vidعربي",
      label: "Vidعربي",
      url: vidlink,
    },
    {
      name: "VidCore",
      label: "VidCore",
      url:
        type === "tv"
          ? `https://vidcore.org/embed/tv/${id}/${season}/${episode}?sub=ar`
          : `https://vidcore.org/embed/movie/${id}?sub=ar`,
    },
    {
      name: "EmbedAPI",
      label: "EmbedAPI",
      url:
        type === "tv"
          ? `https://watch.embed-api.stream/embed/tv/${id}/${season}/${episode}`
          : `https://watch.embed-api.stream/embed/movie/${id}`,
    },
  ];
}
