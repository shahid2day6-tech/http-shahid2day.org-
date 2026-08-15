export default function BrandWordmark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "text-4xl sm:text-5xl"
      : size === "sm"
        ? "text-lg sm:text-xl"
        : "text-2xl sm:text-3xl";

  return (
    <span
      className={`brand-wordmark ${sizeClass} ${className}`}
      aria-label="SHAHID2DAY"
    >
      SHAHID<span className="digit">2</span>DAY
    </span>
  );
}
