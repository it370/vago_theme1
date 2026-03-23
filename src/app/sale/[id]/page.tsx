"use client";

import { use } from "react";
import Link from "next/link";
import { useOffers, useOfferProducts } from "@/features/offers/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: offers } = useOffers();
  const { data: products, isLoading } = useOfferProducts(id);

  const offer = offers?.find((o) => o.id === id);

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
            flexWrap: "wrap",
          }}
        >
          <Link href="/home" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            Home
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <Link href="/sale" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            Sale & Offers
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}>
            {offer?.title ?? "Offer"}
          </span>
        </nav>

        {/* Heading */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              color: "#C9A770",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Exclusive Offer
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
            {offer?.title ?? "Loading…"}
          </h1>
          {offer?.subtitle && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              {offer.subtitle}
            </p>
          )}
          {products && !isLoading && (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
              {products.length} piece{products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Products */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          skeletonCount={12}
          emptyMessage="No items in this offer at the moment. Check back soon."
        />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
