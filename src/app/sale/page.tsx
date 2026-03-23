"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useOffers, useOfferProducts } from "@/features/offers/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";

export default function SalePage() {
  const { data: offers, isLoading: offersLoading } = useOffers();

  const activeOffers = offers?.filter((o) => o.isActive) ?? [];
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");

  // Set first active offer as default once loaded
  useEffect(() => {
    if (activeOffers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(activeOffers[0].id);
    }
  }, [activeOffers, selectedOfferId]);

  const { data: products, isLoading: productsLoading } =
    useOfferProducts(selectedOfferId);

  const selectedOffer = activeOffers.find((o) => o.id === selectedOfferId);

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
          <span style={{ color: "rgba(255,255,255,0.75)" }}>Sale & Offers</span>
        </nav>

        {/* Offer selector tabs */}
        {!offersLoading && activeOffers.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            {activeOffers.map((offer) => {
              const isActive = offer.id === selectedOfferId;
              return (
                <button
                  key={offer.id}
                  onClick={() => setSelectedOfferId(offer.id)}
                  style={{
                    background: isActive ? "#C9A770" : "rgba(255,255,255,0.06)",
                    color: isActive ? "#1C1C1E" : "rgba(255,255,255,0.6)",
                    border: isActive
                      ? "1px solid #C9A770"
                      : "1px solid rgba(255,255,255,0.1)",
                    padding: "0.5rem 1.1rem",
                    fontSize: "0.72rem",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    borderRadius: "0.25rem",
                    transition: "all 0.2s",
                  }}
                >
                  {offer.title}
                </button>
              );
            })}
          </div>
        )}

        {/* Section heading + count */}
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              color: "#C9A770",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            Exclusive Offers
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 600,
              color: "#F0F0F0",
            }}
          >
            {selectedOffer?.title ?? "Sale & Offers"}
          </h2>
          {products && !productsLoading && (
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.82rem",
                marginTop: "0.4rem",
              }}
            >
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

        {/* Products */}
        <ProductGrid
          products={products}
          isLoading={productsLoading || offersLoading}
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
