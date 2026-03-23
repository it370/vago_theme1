"use client";

import { use } from "react";
import Link from "next/link";
import { useFeed } from "@/features/home/queries";
import { useProducts } from "@/features/products/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { resolveCategoryIdForApi } from "@/shared/lib/categoryRoutes";

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: segment } = use(params);
  const { data: feed } = useFeed();
  const categories = feed?.categories;
  const categoryIdForApi = resolveCategoryIdForApi(segment, categories);
  const { data: products, isLoading } = useProducts({ categoryId: categoryIdForApi });

  const category = categories?.find((c) => c.id === categoryIdForApi);

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
          <Link href="/categories" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            Collections
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>
            {category?.name ?? "Category"}
          </span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p
            style={{
              color: "#C9A770",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Category
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "#F0F0F0",
              marginBottom: "0.4rem",
            }}
          >
            {category?.name ?? "Collection"}
          </h1>
          {products && (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
              {products.length} piece{products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <ProductGrid products={products} isLoading={isLoading} skeletonCount={8} />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
