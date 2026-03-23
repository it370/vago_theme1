"use client";

import Link from "next/link";
import { useOffers } from "@/features/offers/queries";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppImage } from "@/shared/components/AppImage";

export default function SalePage() {
  const { data: offers, isLoading } = useOffers();
  const activeOffers = offers?.filter((o) => o.isActive) ?? [];

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
            Exclusive Offers
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "#F0F0F0",
            }}
          >
            Sale & Offers
          </h1>
        </div>

        {/* Divider */}
        <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Offer cards */}
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "10rem",
                  background: "#242426",
                  borderRadius: "0.25rem",
                  animation: "pulse 1.5s ease infinite",
                }}
              />
            ))}
          </div>
        ) : activeOffers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                color: "#F0F0F0",
                marginBottom: "0.5rem",
              }}
            >
              No active offers right now
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "2rem" }}>
              Check back soon for exclusive deals.
            </p>
            <Link
              href="/categories"
              style={{
                background: "#C9A770",
                color: "#1C1C1E",
                fontWeight: 600,
                fontSize: "0.75rem",
                padding: "0.9rem 2rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {activeOffers.map((offer) => (
              <Link
                key={offer.id}
                href={`/sale/${offer.id}`}
                style={{
                  position: "relative",
                  height: "14rem",
                  overflow: "hidden",
                  display: "block",
                  textDecoration: "none",
                  borderRadius: "0.25rem",
                }}
              >
                {offer.imageUrl && (
                  <AppImage
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    objectFit="cover"
                    className="product-img"
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, rgba(28,28,30,0.85), rgba(28,28,30,0.35) 60%, transparent)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    padding: "1.5rem",
                  }}
                >
                  <p
                    style={{
                      color: "#C9A770",
                      fontSize: "0.6rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Offer
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.2rem",
                      color: "#fff",
                      fontWeight: 600,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {offer.title}
                  </h3>
                  {offer.subtitle && (
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.78rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {offer.subtitle}
                    </p>
                  )}
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.75rem",
                      color: "#C9A770",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
