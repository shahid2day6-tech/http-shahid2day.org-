import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discover } from "../lib/tmdb";

export const metadata: Metadata = { title: "أفلام" };
export const revalidate = 3600;

export default async function MoviesPage() {
  const items = await discover("movies", "ar");
  return <BrowseGrid title="أفلام" items={items} />;
}
