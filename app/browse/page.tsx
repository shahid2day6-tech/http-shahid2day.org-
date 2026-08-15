import type { Metadata } from "next";
import { Suspense } from "react";
import FilteredBrowse from "../components/FilteredBrowse";
import { browseHeading, isCatalogSort } from "../lib/filters";
import { dict, type DictKey } from "../lib/i18n";
import { discoverFiltered } from "../lib/tmdb";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type Props = {
  searchParams: Promise<{
    sort?: string;
    section?: string;
    genre?: string;
    year?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const sort = isCatalogSort(params.sort) ? params.sort : "latest";
  return {
    title: browseHeading((key: DictKey) => dict.ar[key], sort, params.section, params.genre, params.year),
  };
}

export default async function BrowsePage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = isCatalogSort(params.sort) ? params.sort : "latest";
  const section = params.section ?? "all";
  const genre = params.genre ?? "";
  const year = params.year ?? "all";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const data = await discoverFiltered("ar", page, {
    sort,
    section,
    genre: genre || undefined,
    year: year === "all" ? undefined : year,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Suspense fallback={null}>
        <FilteredBrowse initial={data} sort={sort} section={section} genre={genre} year={year} />
      </Suspense>
    </div>
  );
}
