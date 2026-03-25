"use client";

import Link from "next/link";
import { useOffers } from "@/features/offers/queries";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppImage } from "@/shared/components/AppImage";
import { theme } from "@/shared/constants/theme";
import {
  listingMainStyle,
  crumbLinkStyle,
  crumbSepStyle,
  crumbCurrentStyle,
  sectionEyebrowStyle,
  pageHeadingStyle,
} from "@/shared/lib/listingChrome";

export default function SalePage() {
  const { data: offers, isLoading } = useOffers();
  const activeOffers = offers?.filter((o) => o.isActive) ?? [];

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
          <span style={crumbCurrentStyle}>Sale & Offers</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={sectionEyebrowStyle}>
            Exclusive Offers
          </p>
          <h1
            style={pageHeadingStyle}
          >
            Sale & Offers
          </h1>
        </div>

        {/* Divider */}
        <div style={{ marginBottom: "2.5rem", borderBottom: `1px solid ${theme.border}` }} />

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
                  background: theme.skeleton,
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
                color: theme.fg,
                marginBottom: "0.5rem",
              }}
            >
              No active offers right now
            </p>
            <p style={{ color: theme.fgSubtle, fontSize: "0.85rem", marginBottom: "2rem" }}>
              Check back soon for exclusive deals.
            </p>
            <Link
              href="/categories"
              style={{
                background: theme.accent,
                color: theme.onAccent,
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
                    background: theme.offerOverlay,
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
                      color: theme.accent,
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
                      color: theme.fg,
                      fontWeight: 600,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {offer.title}
                  </h3>
                  {offer.subtitle && (
                    <p
                      style={{
                        color: theme.fgMuted,
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
                      color: theme.accent,
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
