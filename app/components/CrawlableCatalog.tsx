import { crawlItemListSchema, getCrawlCatalog } from "../lib/crawlCatalog";
import CrawlableCatalogView from "./CrawlableCatalogView";

export default async function CrawlableCatalog({
  kind = "home",
  compact = false,
}: {
  kind?: "home" | "movies" | "series" | "anime";
  compact?: boolean;
}) {
  const links = await getCrawlCatalog(kind);
  if (links.length === 0) return null;

  return (
    <>
      <CrawlableCatalogView kind={kind} links={links} compact={compact} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crawlItemListSchema(links)) }}
      />
    </>
  );
}
