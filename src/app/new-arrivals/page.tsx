"use client";

import { useState } from "react";
import Link from "next/link";
import { useNewArrivals } from "@/features/home/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import type { ViewMode } from "@/shared/components/ListingToolbar";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import {
  listingMainStyle,
  crumbLinkStyle,
  crumbSepStyle,
  crumbCurrentStyle,
  sectionEyebrowStyle,
  pageHeadingStyle,
} from "@/shared/lib/listingChrome";

export default function NewArrivalsPage() {
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const { data, isLoading } = useNewArrivals();

  const label = data?.label ?? "New Arrivals";
  const allProducts = data?.products ?? [];

  // Client-side sort since new-arrivals endpoint returns a fixed list
  const products = [...allProducts].sort((a, b) => {
    if (sortBy === "price_asc") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    if (sortBy === "price_desc") return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    return 0; // newest — keep original order
  });

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
          <span style={crumbCurrentStyle}>New Arrivals</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={sectionEyebrowStyle}>
            {label}
          </p>
          <h1
            style={pageHeadingStyle}
          >
            Just Arrived
          </h1>
        </div>

        <ListingToolbar
          totalItems={products.length || undefined}
          sortBy={sortBy}
          onSortChange={setSortBy}
          view={view}
          onViewChange={setView}
          isLoading={isLoading}
        />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          skeletonCount={12}
          view={view}
          emptyMessage="New pieces are on their way. Check back soon."
        />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
