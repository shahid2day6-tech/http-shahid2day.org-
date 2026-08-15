import type { Metadata } from "next";
import BrowseGrid from "../components/BrowseGrid";
import { discover } from "../lib/tmdb";

export const metadata: Metadata = { title: "عربية" };
export const revalidate = 3600;

export default async function ArabicPage() {
  const items = await discover("arabic", "ar");
  return <BrowseGrid title="عربية" items={items} />;
}
