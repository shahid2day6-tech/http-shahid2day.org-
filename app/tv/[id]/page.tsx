import { cookies } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { titleHref } from "../../lib/slug";
import { getTitle } from "../../lib/tmdb";
import { parseUiLang, UI_LANG_KEY } from "../../lib/langPref";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export default async function TvIdRedirect({ params }: Props) {
  const { id } = await params;
  const title = await getTitle("tv", Number(id), "ar");
  if (!title) notFound();
  const lang = parseUiLang((await cookies()).get(UI_LANG_KEY)?.value);
  permanentRedirect(titleHref(title, lang));
}
