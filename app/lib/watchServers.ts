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

  const oneEmbed =
    type === "tv"
      ? `https://1embed.cc/embed/tv/${id}/${season}/${episode}`
      : `https://1embed.cc/embed/movie/${id}`;

  const twoEmbed =
    type === "tv"
      ? `https://www.2embed.cc/embedtv/${id}?s=${season}&e=${episode}`
      : `https://www.2embed.cc/embed/${id}`;

  const vidsrcTo =
    type === "tv"
      ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}?ds_lang=ar`
      : `https://vidsrc.to/embed/movie/${id}?ds_lang=ar`;

  return [
    {
      name: "shahid2day",
      label: "shahid2day",
      recommended: true,
      url: `${vidlink}&sub=ar&ds_lang=ar&lang=ar&audio_lang=ar`,
    },
    {
      name: "1Embed",
      label: "1Embed",
      url: oneEmbed,
    },
    {
      name: "2Embed",
      label: "2Embed",
      url: twoEmbed,
    },
    {
      name: "VidLink",
      label: "VidLink",
      url: vidlink,
    },
    {
      name: "VidLink1",
      label: "VidLink1",
      url: vidsrcTo,
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
          ? `https://player.videasy.to/tv/${id}/${season}/${episode}?color=e50914`
          : `https://player.videasy.to/movie/${id}?color=e50914`,
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
      name: "Smashy",
      label: "Smashy",
      url:
        type === "tv"
          ? `https://anyembed.xyz/embed/tmdb-tv-${id}-${season}-${episode}?subLang=Arabic`
          : `https://anyembed.xyz/embed/tmdb-movie-${id}?subLang=Arabic`,
    },
  ];
}
