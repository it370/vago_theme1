"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useOffers, useOfferProducts } from "@/features/offers/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import type { ViewMode } from "@/shared/components/ListingToolbar";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { theme } from "@/shared/constants/theme";
import {
  listingMainStyle,
  crumbLinkStyle,
  crumbSepStyle,
  crumbCurrentStyle,
  sectionEyebrowStyle,
  pageHeadingStyle,
} from "@/shared/lib/listingChrome";

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
            flexWrap: "wrap",
          }}
        >
          <Link href="/home" style={crumbLinkStyle}>
            Home
          </Link>
          <span style={crumbSepStyle}>›</span>
          <Link href="/sale" style={crumbLinkStyle}>
            Sale & Offers
          </Link>
          <span style={crumbSepStyle}>›</span>
          <span style={crumbCurrentStyle}>
            {offer?.title ?? "Offer"}
          </span>
        </nav>

        {/* Heading */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={sectionEyebrowStyle}>
            Exclusive Offer
          </p>
          <h1
            style={{ ...pageHeadingStyle, marginBottom: "0.4rem" }}
          >
            {offer?.title ?? "Loading…"}
          </h1>
          {offer?.subtitle && (
            <p style={{ color: theme.fgMuted, fontSize: "0.88rem", lineHeight: 1.6 }}>
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
