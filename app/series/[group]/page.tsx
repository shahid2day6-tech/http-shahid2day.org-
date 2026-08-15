import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrowseGrid from "../../components/BrowseGrid";
import { RAMADAN_GROUPS, SERIES_GROUPS, isTvCatalogGroup } from "../../lib/catalog";
import { discoverBrowse } from "../../lib/tmdb";
import { dict } from "../../lib/i18n";

export const revalidate = 3600;

type Props = { params: Promise<{ group: string }> };

const TV_GROUPS = [...SERIES_GROUPS, ...RAMADAN_GROUPS];

export function generateStaticParams() {
  return TV_GROUPS.map(({ group }) => ({ group }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params;
  const item = TV_GROUPS.find((entry) => entry.group === group);
  return { title: item ? dict.ar[item.label] : "مسلسلات" };
}

export default async function SeriesGroupPage({ params }: Props) {
  const { group } = await params;
  if (!isTvCatalogGroup(group)) notFound();
  const item = TV_GROUPS.find((entry) => entry.group === group)!;
  const data = await discoverBrowse({ kind: "tv", group }, "ar", 1);
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
