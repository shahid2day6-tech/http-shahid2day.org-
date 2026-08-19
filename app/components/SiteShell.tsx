"use client";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { SiteAdsterraRail } from "./ads/SiteAdsterraRail";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div data-site-chrome="1">
        <Navbar />
      </div>
      <main data-site-root="1">{children}</main>
      <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6">
        <SiteAdsterraRail variant="alt" className="mt-6" />
      </div>
      <Footer />
    </>
  );
}
