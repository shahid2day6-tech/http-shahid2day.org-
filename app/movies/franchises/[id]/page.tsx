import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrowseGrid from "../../../components/BrowseGrid";
import { getFranchise } from "../../../lib/tmdb";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric) || numeric <= 0) return { title: "سلاسل الأفلام" };
  const data = await getFranchise(numeric, "ar");
  return { title: data ? `سلسلة ${data.title}` : "سلاسل الأفلام" };
}

export default async function FranchisePage({ params }: Props) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric) || numeric <= 0) notFound();
  const data = await getFranchise(numeric, "ar");
  if (!data) notFound();

  return (
    <BrowseGrid
      title={data.title}
      titleKey="franchise"
      items={data.items}
      showFilters={false}
      totalResults={data.items.length}
    />
  );
}
