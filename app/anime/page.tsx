import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discover } from "../lib/tmdb";

export const metadata: Metadata = { title: "أنمي" };
export const revalidate = 3600;

export default async function AnimePage() {
  const items = await discover("anime", "ar");
  return <BrowseGrid title="أنمي" items={items} />;
}
