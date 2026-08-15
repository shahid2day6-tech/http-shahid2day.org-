import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="شاهد تو داي | SHAHID2DAY"
        width={40}
        height={40}
        className="h-10 w-10 rounded-lg object-cover ring-1 ring-[#e50914]/50"
        priority
      />
      <span className="leading-tight">
        <span className="block text-[17px] font-black tracking-tight">شاهد تو داي</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#e6e2d8]/70">
          SHAHID2DAY
        </span>
      </span>
    </span>
  );
}
