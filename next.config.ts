import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [{ key: "Content-Type", value: "application/xml; charset=utf-8" }],
      },
      {
        source: "/sitemap/:path*.xml",
        headers: [{ key: "Content-Type", value: "application/xml; charset=utf-8" }],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
