import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discover } from "../lib/tmdb";

export const metadata: Metadata = { title: "تركية" };
export const revalidate = 3600;

export default async function TurkishPage() {
  const items = await discover("turkish", "ar");
  return <BrowseGrid title="تركية" items={items} />;
}
