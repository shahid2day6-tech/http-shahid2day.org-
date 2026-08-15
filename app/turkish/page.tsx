import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discoverBrowse } from "../lib/tmdb";

export const metadata: Metadata = { title: "تركية" };
export const revalidate = 3600;

export default async function TurkishPage() {
  const data = await discoverBrowse({ category: "turkish" }, "ar", 1);
  return (
    <BrowseGrid
      title="تركية"
      category="turkish"
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
