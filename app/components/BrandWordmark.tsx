export default function BrandWordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeClass =
    size === "xl"
      ? "text-5xl sm:text-6xl md:text-7xl"
      : size === "lg"
        ? "text-4xl sm:text-5xl"
        : size === "sm"
          ? "text-xl"
          : "text-[28px] sm:text-[32px]";

  return (
    <span
      className={`brand-wordmark ${sizeClass} ${className}`}
      aria-label="SHAHID2DAY"
      dir="ltr"
    >
      SHAHID
      <span className="digit">2</span>
      DAY
    </span>
  );
}
