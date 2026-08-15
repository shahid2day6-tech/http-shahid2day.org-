import { notFound, permanentRedirect } from "next/navigation";
import { titleHref } from "../../lib/slug";
import { getTitle } from "../../lib/tmdb";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export default async function MovieIdRedirect({ params }: Props) {
  const { id } = await params;
  const title = await getTitle("movie", Number(id), "ar");
  if (!title) notFound();
  permanentRedirect(titleHref(title));
}
