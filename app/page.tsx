import { homeCatalog } from "./lib/tmdb";
import HomeCatalog from "./components/HomeCatalog";
import CrawlableCatalog from "./components/CrawlableCatalog";

export const revalidate = 3600;

export default async function HomePage() {
  const catalog = await homeCatalog("ar");
  return (
    <>
      <HomeCatalog {...catalog} />
      <CrawlableCatalog kind="home" />
    </>
  );
}
