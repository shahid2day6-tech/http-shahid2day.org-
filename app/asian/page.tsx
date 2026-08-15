import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discoverBrowse } from "../lib/tmdb";

export const metadata: Metadata = { title: "آسيوية" };
export const revalidate = 3600;

export default async function AsianPage() {
  const data = await discoverBrowse({ category: "asian" }, "ar", 1);
  return (
    <BrowseGrid
      title="آسيوية"
      category="asian"
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
