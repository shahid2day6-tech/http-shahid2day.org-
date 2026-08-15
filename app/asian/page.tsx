import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { BROWSE_PRELOAD_PAGES, discoverMany } from "../lib/tmdb";

export const metadata: Metadata = { title: "آسيوية" };
export const revalidate = 3600;

export default async function AsianPage() {
  const data = await discoverMany("asian", "ar", 1, BROWSE_PRELOAD_PAGES);
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
