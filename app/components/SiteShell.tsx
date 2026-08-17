"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { SiteAdsterraRail } from "./ads/SiteAdsterraRail";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/watch") {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <SiteAdsterraRail />
        <SiteAdsterraRail variant="box" className="mt-4" />
      </div>
      <main>{children}</main>
      <div className="mx-auto max-w-7xl px-4 pb-2 sm:px-6">
        <SiteAdsterraRail variant="alt" className="mt-6" />
      </div>
      <Footer />
    </>
  );
}
