import type { Metadata } from "next";
import WatchPlayer from "../components/WatchPlayer";

export const metadata: Metadata = {
  title: "شاهد الان",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    id?: string;
    type?: string;
    season?: string;
    episode?: string;
  }>;
};

export default async function WatchPage({ searchParams }: Props) {
  const params = await searchParams;
  const id = (params.id || "").replace(/\D/g, "");
  const type = params.type === "tv" ? "tv" : "movie";
  const season = Math.max(1, Number(params.season) || 1);
  const episode = Math.max(1, Number(params.episode) || 1);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-3xl font-black text-white sm:text-5xl">شاهد الان</p>
      </div>
    );
  }

  return <WatchPlayer id={id} type={type} season={season} episode={episode} />;
}
