import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discoverBrowse } from "../lib/tmdb";

export const metadata: Metadata = { title: "عربية" };
export const revalidate = 3600;

export default async function ArabicPage() {
  const data = await discoverBrowse({ category: "arabic" }, "ar", 1);
  return (
    <BrowseGrid
      title="عربية"
      category="arabic"
      initialItems={data.items}
      initialPage={data.page}
      totalPages={data.totalPages}
      totalResults={data.totalResults}
    />
  );
}
