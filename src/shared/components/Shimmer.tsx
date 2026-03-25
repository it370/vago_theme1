import { clsx } from "clsx";
import { theme } from "@/shared/constants/theme";

interface ShimmerProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Shimmer({ className, style }: ShimmerProps) {
  return (
    <div
      className={clsx("animate-pulse", className)}
      style={{ background: theme.shimmer, ...style }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Shimmer style={{ aspectRatio: "3/4", marginBottom: "0.75rem" }} />
      <Shimmer style={{ height: "0.6rem", width: "40%", marginBottom: "0.4rem" }} />
      <Shimmer style={{ height: "0.85rem", width: "80%", marginBottom: "0.35rem" }} />
      <Shimmer style={{ height: "0.85rem", width: "30%" }} />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="r-product-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
