import BrandWordmark from "./BrandWordmark";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <BrandWordmark size="md" />
    </span>
  );
}
