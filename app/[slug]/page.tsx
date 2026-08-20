import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import TitleView from "../components/TitleView";
import { parseTitleSlug } from "../lib/slug";
import { getTitleBySlug, listingTitle, titleOverview } from "../lib/tmdb";
import { titleKeywords } from "../lib/seo";
import { isBlockedWatchParam } from "../lib/blockedTitles";
import { parseUiLang, UI_LANG_KEY } from "../lib/langPref";

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
  const lang = parseUiLang((await cookies()).get(UI_LANG_KEY)?.value);
  const heading = listingTitle(title, lang);
  const description = titleOverview(title, lang) || heading;
  return {
    title: heading,
    description: description,
    keywords: titleKeywords(title.title, heading, { year: title.year, type: title.type }),
    openGraph: {
      title: `${heading} | SHAHID2DAY | شاهد تو داي`,
      description,
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
