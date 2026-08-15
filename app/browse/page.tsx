import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import CatalogToolbar from "../components/CatalogToolbar";
import { isCatalogSort } from "../lib/filters";
import { discoverFiltered } from "../lib/tmdb";

export const revalidate = 1800;

type Props = {
  searchParams: Promise<{
    sort?: string;
    section?: string;
    genre?: string;
    year?: string;
    page?: string;
  }>;
};

export const metadata: Metadata = { title: "تصفح" };

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
      <CatalogToolbar sort={sort} section={section} genre={genre} year={year} />
      <BrowseGrid
        title="تصفح"
        embedded
        showFilters={false}
        query={{ sort, section, genre, year }}
        initialItems={data.items}
        initialPage={data.page}
        totalPages={data.totalPages}
        totalResults={data.totalResults}
      />
    </div>
  );
}
