import type { Metadata } from "next";
import CrawlableCatalog from "../components/CrawlableCatalog";
import AboutCopy from "./AboutCopy";

export const metadata: Metadata = {
  title: { absolute: "About shahid2day | أفلام مترجمة اون لاين" },
  description:
    "أفلام مترجمة اون لاين. مسلسلات مترجمة اون لاين. تعمق في موقع انمي عربي — شاهد تو داي.",
  keywords: [
    "أفلام مترجمة اون لاين",
    "مسلسلات مترجمة اون لاين",
    "تعمق في موقع انمي عربي — شاهد تو داي",
  ],
};

export default function AboutPage() {
  return (
    <>
      <AboutCopy />
      <CrawlableCatalog kind="movies" />
      <CrawlableCatalog kind="series" />
      <CrawlableCatalog kind="anime" />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="mt-10 rounded-xl border border-[#262626] bg-[#141414] p-4">
          <p className="text-xs text-[#a3a3a3]">Contact</p>
          <p className="mt-1 text-sm font-medium text-white">contact@shahid2day.org</p>
        </div>
      </div>
    </>
  );
}
