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
import { useState } from "react";
import {
  listingMainStyle,
  crumbLinkStyle,
  crumbSepStyle,
  crumbCurrentStyle,
  sectionEyebrowStyle,
  pageHeadingStyle,
} from "@/shared/lib/listingChrome";

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
    <main style={listingMainStyle} className="animate-page-in">
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
          <Link href="/home" style={crumbLinkStyle}>
            Home
          </Link>
          <span style={crumbSepStyle}>›</span>
          <span style={crumbCurrentStyle}>Collections</span>
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
            <p style={sectionEyebrowStyle}>
              All Pieces
            </p>
            <h1
              style={pageHeadingStyle}
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
