import { homeCatalog } from "./lib/tmdb";
import HomeCatalog from "./components/HomeCatalog";

export const revalidate = 3600;

export default async function HomePage() {
  const catalog = await homeCatalog("ar");
  return <HomeCatalog {...catalog} />;
}
