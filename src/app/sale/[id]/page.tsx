"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useOffers, useOfferProducts } from "@/features/offers/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import type { ViewMode } from "@/shared/components/ListingToolbar";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";

export default function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const { data: offers } = useOffers();
  const { data: rawProducts, isLoading } = useOfferProducts(id);

  const products = rawProducts
    ? [...rawProducts].sort((a, b) => {
        if (sortBy === "price_asc") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        if (sortBy === "price_desc") return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        return 0;
      })
    : undefined;

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
        </div>

        <ListingToolbar
          totalItems={products?.length}
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
          emptyMessage="No items in this offer at the moment. Check back soon."
        />
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
