import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="شاهد تو داي | SHAHID2DAY"
        width={96}
        height={96}
        className="h-16 w-16 rounded-2xl object-cover ring-1 ring-[#e50914]/60 sm:h-20 sm:w-20 md:h-24 md:w-24"
        priority
      />
      <span className="leading-tight">
        <span className="block text-lg font-black tracking-tight sm:text-xl">شاهد تو داي</span>
        <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#e6e2d8]/70">
          SHAHID2DAY
        </span>
      </span>
    </span>
  );
}
