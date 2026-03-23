"use client";

import Link from "next/link";
import { useWishlist } from "@/features/wishlist/queries";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { Heart } from "lucide-react";

function WishlistContent() {
  const { data, isLoading } = useWishlist();
  const products = data?.products ?? [];

  return (
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
        <span style={{ color: "rgba(255,255,255,0.75)" }}>Wishlist</span>
      </nav>

      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "#C9A770", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Saved Items
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#F0F0F0" }}>
          Your Wishlist
        </h1>
      </div>

      {!isLoading && products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <Heart size={48} style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 1.5rem" }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "0.5rem", color: "#F0F0F0" }}>
            Nothing saved yet
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            Tap the heart on any product to save it here.
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
        <ProductGrid products={products} isLoading={isLoading} skeletonCount={4} />
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AuthGuard>
      <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">
        <WishlistContent />
        <Footer />
        <div className="r-bottom-spacer" />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
