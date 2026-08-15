import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شاهد الان",
  robots: { index: false, follow: false },
};

export default function WatchPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-3xl font-black text-white sm:text-5xl">شاهد الان</p>
    </div>
  );
}
