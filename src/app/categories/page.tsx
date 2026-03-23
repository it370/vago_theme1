"use client";

import Link from "next/link";
import { useFeed } from "@/features/home/queries";
import { useProducts } from "@/features/products/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { FilterPanel } from "@/shared/components/FilterPanel";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import type { ViewMode } from "@/shared/components/ListingToolbar";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppImage } from "@/shared/components/AppImage";
import { useState } from "react";

export default function CategoriesPage() {
  const { data: feed } = useFeed();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const { data: products, isLoading } = useProducts({
    categoryId: activeCategoryId ?? undefined,
    sortBy,
  });

  const categories = feed?.categories ?? [];

  return (
    <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            fontSize: "0.8rem",
          }}
        >
          <Link href="/home" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>Collections</span>
        </nav>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                color: "#C9A770",
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              All Pieces
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 600,
                color: "#F0F0F0",
              }}
            >
              {activeCategoryId
                ? (categories.find((c) => c.id === activeCategoryId)?.name ?? "Collection")
                : "Full Collection"}
            </h1>
          </div>

        </div>

        {/* Category filter pills */}
        <div style={{ marginBottom: "1.5rem" }}>
          <FilterPanel
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </div>

        {/* Toolbar — sort + view toggle */}
        <ListingToolbar
          totalItems={products?.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          view={view}
          onViewChange={setView}
          isLoading={isLoading}
        />

        <ProductGrid products={products} isLoading={isLoading} skeletonCount={12} view={view} />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
