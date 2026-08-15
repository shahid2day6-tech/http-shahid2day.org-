import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrowseGrid from "../../components/BrowseGrid";
import { SERIES_GROUPS, isSeriesGroup } from "../../lib/catalog";
import { BROWSE_PRELOAD_PAGES, discoverCatalogMany } from "../../lib/tmdb";
import { dict } from "../../lib/i18n";

export const revalidate = 3600;

type Props = { params: Promise<{ group: string }> };

export function generateStaticParams() {
  return SERIES_GROUPS.map(({ group }) => ({ group }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params;
  const item = SERIES_GROUPS.find((entry) => entry.group === group);
  return { title: item ? dict.ar[item.label] : "مسلسلات" };
}

export default async function SeriesGroupPage({ params }: Props) {
  const { group } = await params;
  if (!isSeriesGroup(group)) notFound();
  const item = SERIES_GROUPS.find((entry) => entry.group === group)!;
  const data = await discoverCatalogMany("tv", group, "ar", 1, BROWSE_PRELOAD_PAGES);
  return (
    <BrowseGrid
      title={dict.ar[item.label]}
      kind="tv"
      group={group}
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
