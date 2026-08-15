import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrowseGrid from "../../components/BrowseGrid";
import { MOVIE_GROUPS, isMovieGroup } from "../../lib/catalog";
import { discoverBrowse } from "../../lib/tmdb";
import { dict } from "../../lib/i18n";

export const revalidate = 3600;

type Props = { params: Promise<{ group: string }> };

export function generateStaticParams() {
  return MOVIE_GROUPS.map(({ group }) => ({ group }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params;
  const item = MOVIE_GROUPS.find((entry) => entry.group === group);
  return { title: item ? dict.ar[item.label] : "أفلام" };
}

export default async function MovieGroupPage({ params }: Props) {
  const { group } = await params;
  if (!isMovieGroup(group)) notFound();
  const item = MOVIE_GROUPS.find((entry) => entry.group === group)!;
  const data = await discoverBrowse({ kind: "movie", group }, "ar", 1);
  return (
    <BrowseGrid
      title={dict.ar[item.label]}
      kind="movie"
      group={group}
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
