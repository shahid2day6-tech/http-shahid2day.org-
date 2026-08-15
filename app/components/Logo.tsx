export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
        <rect width="34" height="34" rx="9" fill="#e50914" />
        <path d="M13 10.5v13l11-6.5-11-6.5z" fill="#e6e2d8" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[17px] font-black tracking-tight">شاهد لليوم</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#e6e2d8]/70">
          Shahid2Day
        </span>
      </span>
    </span>
  );
}
