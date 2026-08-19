import Link from "next/link";
import { crawlItemListSchema, getCrawlCatalog } from "../lib/crawlCatalog";

export default async function CrawlableCatalog({
  kind = "home",
  compact = false,
}: {
  kind?: "home" | "movies" | "series" | "anime";
  compact?: boolean;
}) {
  const links = await getCrawlCatalog(kind);
  if (links.length === 0) return null;

  const heading =
    kind === "movies"
      ? "أفلام مترجمة اون لاين"
      : kind === "series"
        ? "مسلسلات مترجمة اون لاين"
        : kind === "anime"
          ? "تعمق في موقع انمي عربي — شاهد تو داي"
          : "أفلام ومسلسلات مترجمة اون لاين";

  const blurb =
    kind === "anime"
      ? "موقع انمي عربي. شاهد أحدث الأنمي المترجم مجاناً بجودة HD على شاهد تو داي."
      : "أفلام ومسلسلات مترجمة اون لاين. شاهد أحدث الأفلام والمسلسلات المترجمة مجاناً بجودة HD على شاهد تو داي.";

  return (
    <section className={`mx-auto px-4 pb-16 sm:px-6 ${compact ? "max-w-3xl" : "max-w-[1100px]"}`}>
      <h2 className="mb-4 text-xl font-black text-white sm:text-2xl">{heading}</h2>
      <p className="mb-5 text-sm text-[#a3a3a3]">{blurb}</p>
      <ul className={`grid grid-cols-1 gap-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-lg border border-[#262626] bg-[#141414] px-3 py-2 text-sm text-white transition hover:border-[#e50914] hover:text-[#e50914]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crawlItemListSchema(links)) }}
      />
    </section>
  );
}
