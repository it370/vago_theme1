"use client";

import Link from "next/link";
import { useFeed } from "@/features/home/queries";
import { useProducts } from "@/features/products/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { FilterPanel } from "@/shared/components/FilterPanel";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppImage } from "@/shared/components/AppImage";
import { useState } from "react";

export default function CategoriesPage() {
  const { data: feed } = useFeed();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");

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
            {products && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
                {products.length} piece{products.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "#2C2C2E",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "0.5rem 0.9rem",
              fontSize: "0.78rem",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              outline: "none",
              borderRadius: "0.25rem",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Filter pills */}
        <div
          style={{
            marginBottom: "2.5rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <FilterPanel
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        </div>

        {/* Product grid */}
        <ProductGrid products={products} isLoading={isLoading} skeletonCount={12} />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
