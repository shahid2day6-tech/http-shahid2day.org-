import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TitleView from "../../components/TitleView";
import { getTitle, listingTitle } from "../../lib/tmdb";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = await getTitle("tv", Number(id), "ar");
  if (!title) return { title: "مسلسل" };
  return {
    title: listingTitle(title),
    description: title.overview || title.title,
  };
}

export default async function TvPage({ params }: Props) {
  const { id } = await params;
  const title = await getTitle("tv", Number(id), "ar");
  if (!title) notFound();
  return <TitleView title={title} />;
}
