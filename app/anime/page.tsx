import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { BROWSE_PRELOAD_PAGES, discoverMany } from "../lib/tmdb";

export const metadata: Metadata = { title: "أنمي" };
export const revalidate = 3600;

export default async function AnimePage() {
  const data = await discoverMany("anime", "ar", 1, BROWSE_PRELOAD_PAGES);
  return (
    <BrowseGrid
      title="أنمي"
      category="anime"
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
