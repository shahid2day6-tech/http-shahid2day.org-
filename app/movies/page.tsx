import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discoverBrowse } from "../lib/tmdb";

export const metadata: Metadata = { title: "أفلام" };
export const revalidate = 3600;

export default async function MoviesPage() {
  const data = await discoverBrowse({ category: "movies" }, "ar", 1);
  return (
    <BrowseGrid
      title="أفلام"
      category="movies"
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
