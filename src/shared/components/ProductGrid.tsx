import type { Product } from "@/shared/types";
import type { ViewMode } from "./ListingToolbar";
import { ProductCard } from "./ProductCard";
import { ProductRowCard } from "./ProductRowCard";
import { ProductGridSkeleton } from "./Shimmer";
import { theme } from "@/shared/constants/theme";

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
  view?: ViewMode;
}

export function ProductGrid({
  products,
  isLoading,
  skeletonCount = 8,
  emptyMessage = "No products found.",
  view = "grid",
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={skeletonCount} />;
  }

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem 0",
          color: theme.fgSubtle,
        }}
      >
        <svg
          width="48"
          height="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 24 24"
          style={{ margin: "0 auto 1rem", opacity: 0.4 }}
        >
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
        <p style={{ fontSize: "1rem", fontFamily: "'Playfair Display', serif", marginBottom: "0.5rem" }}>
          Nothing here yet
        </p>
        <p style={{ fontSize: "0.85rem" }}>{emptyMessage}</p>
      </div>
    );
  }

  if (view === "row") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {products.map((p) => (
          <ProductRowCard key={p.id} product={p} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="r-product-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
