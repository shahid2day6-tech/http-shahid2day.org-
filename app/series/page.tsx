import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discover } from "../lib/tmdb";

export const metadata: Metadata = { title: "مسلسلات" };
export const revalidate = 3600;

export default async function SeriesPage() {
  const items = await discover("series", "ar");
  return <BrowseGrid title="مسلسلات" items={items} />;
}
