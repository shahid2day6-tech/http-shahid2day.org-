import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discover } from "../lib/tmdb";

export const metadata: Metadata = { title: "آسيوية" };
export const revalidate = 3600;

export default async function AsianPage() {
  const items = await discover("asian", "ar");
  return <BrowseGrid title="آسيوية" items={items} />;
}
