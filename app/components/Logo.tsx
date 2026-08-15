import BrandWordmark from "./BrandWordmark";

export default function Logo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <BrandWordmark size={size} />
    </span>
  );
}
