import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TitleView from "../components/TitleView";
import { parseTitleSlug } from "../lib/slug";
import { getTitleBySlug, listingTitle } from "../lib/tmdb";
import { titleKeywords } from "../lib/seo";
import { isBlockedWatchParam } from "../lib/blockedTitles";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

const RESERVED_SLUGS = new Set(["sitemap.xml", "robots.txt", "manifest.webmanifest", "favicon.ico"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug) || !parseTitleSlug(slug)) return { title: "شاهد تو داي" };
  if (isBlockedWatchParam(slug, "movie") || isBlockedWatchParam(slug, "tv")) {
    return { title: "شاهد تو داي", robots: { index: false, follow: false } };
  }
  const title = await getTitleBySlug(slug, "ar");
  if (!title) return { title: "شاهد تو داي" };
  const heading = listingTitle(title);
  return {
    title: heading,
    description: title.overview || heading,
    keywords: titleKeywords(title.title, heading, { year: title.year, type: title.type }),
    openGraph: {
      title: `${heading} | شاهد تو داي | SHAHID2DAY`,
      description: title.overview || heading,
    },
  };
}

export default async function TitleSlugPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug) || !parseTitleSlug(slug)) notFound();
  if (isBlockedWatchParam(slug, "movie") || isBlockedWatchParam(slug, "tv")) notFound();
  const title = await getTitleBySlug(slug, "ar");
  if (!title) notFound();
  return <TitleView title={title} />;
}
