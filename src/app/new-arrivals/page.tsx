"use client";

import Link from "next/link";
import { useNewArrivals } from "@/features/home/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";

export default function NewArrivalsPage() {
  const { data, isLoading } = useNewArrivals();

  const products = data?.products;
  const label = data?.label ?? "New Arrivals";

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
          <span style={{ color: "rgba(255,255,255,0.75)" }}>New Arrivals</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              color: "#C9A770",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            {label}
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "#F0F0F0",
            }}
          >
            Just Arrived
          </h1>
          {products && !isLoading && (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
              {products.length} piece{products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            marginBottom: "2.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        />

        {/* Product grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          skeletonCount={12}
          emptyMessage="New pieces are on their way. Check back soon."
        />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
