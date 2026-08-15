import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TitleView from "../components/TitleView";
import { parseTitleSlug } from "../lib/slug";
import { getTitleBySlug, listingTitle } from "../lib/tmdb";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!parseTitleSlug(slug)) return { title: "شاهد تو داي" };
  const title = await getTitleBySlug(slug, "ar");
  if (!title) return { title: "شاهد تو داي" };
  return {
    title: listingTitle(title),
    description: title.overview || title.title,
  };
}

export default async function TitleSlugPage({ params }: Props) {
  const { slug } = await params;
  if (!parseTitleSlug(slug)) notFound();
  const title = await getTitleBySlug(slug, "ar");
  if (!title) notFound();
  return <TitleView title={title} />;
}
