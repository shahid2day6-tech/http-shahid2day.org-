import type { MetadataRoute } from "next";
import { SITE_NAME_AR, SITE_NAME_EN, SITE_URL } from "./lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME_AR} | ${SITE_NAME_EN}`,
    short_name: SITE_NAME_EN,
    description: "أفلام ومسلسلات وأنمي عربي وتركي وآسيوي",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#e50914",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    id: SITE_URL,
  };
}
