"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useFeed } from "@/features/home/queries";
import { useProducts } from "@/features/products/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import type { ViewMode } from "@/shared/components/ListingToolbar";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { resolveCategoryIdForApi } from "@/shared/lib/categoryRoutes";
import {
  listingMainStyle,
  crumbLinkStyle,
  crumbSepStyle,
  crumbCurrentStyle,
  sectionEyebrowStyle,
  pageHeadingStyle,
} from "@/shared/lib/listingChrome";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: segment } = use(params);
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const { data: feed } = useFeed();
  const categories = feed?.categories;
  const categoryIdForApi = resolveCategoryIdForApi(segment, categories);
  const { data: products, isLoading } = useProducts({ categoryId: categoryIdForApi, sortBy });

  const category = categories?.find((c) => c.id === categoryIdForApi);

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
          <Link href="/categories" style={crumbLinkStyle}>
            Collections
          </Link>
          <span style={crumbSepStyle}>›</span>
          <span style={crumbCurrentStyle}>
            {category?.name ?? "Category"}
          </span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={sectionEyebrowStyle}>
            Category
          </p>
          <h1
            style={{ ...pageHeadingStyle, marginBottom: "0.4rem" }}
          >
            {category?.name ?? "Collection"}
          </h1>
        </div>

        <ListingToolbar
          totalItems={products?.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          view={view}
          onViewChange={setView}
          isLoading={isLoading}
        />

        <ProductGrid products={products} isLoading={isLoading} skeletonCount={8} view={view} />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
