import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discoverBrowse } from "../lib/tmdb";

export const metadata: Metadata = { title: "مسلسلات" };
export const revalidate = 3600;

export default async function SeriesPage() {
  const data = await discoverBrowse({ category: "series" }, "ar", 1);
  return (
    <BrowseGrid
      title="مسلسلات"
      category="series"
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
