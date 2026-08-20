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
      {
        source: "/api/movie/:path*",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
      },
      {
        source: "/api/tv/:path*",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
      },
      {
        source: "/api/discover",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=600, stale-while-revalidate=1800" }],
      },
      {
        source: "/api/search",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=120, stale-while-revalidate=600" }],
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
