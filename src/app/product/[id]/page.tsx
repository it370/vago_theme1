"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useProduct } from "@/features/products/queries";
import { useAddToCart } from "@/features/cart/queries";
import { useToggleWishlist, useWishlistProductIds } from "@/features/wishlist/queries";
import { useAuthStore } from "@/features/auth/store";
import { ImageGallery } from "@/shared/components/ImageGallery";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { formatPrice } from "@/features/products/normalize";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Check } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: product, isLoading } = useProduct(id);
  const { user } = useAuthStore();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const wishlistIds = useWishlistProductIds();
  const isWishlisted = wishlistIds.includes(id);

  const effectivePrice = product?.salePrice ?? product?.price ?? 0;
  const hasDiscount = !!product?.salePrice && product.salePrice < (product?.price ?? 0);

  function handleAddToCart() {
    if (!user) { router.push("/login"); return; }
    if (!product) return;
    addToCart.mutate(
      { productId: product.id, quantity: 1, selectedSize: selectedSize ?? undefined, selectedColor: selectedColor ?? undefined },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2500);
        },
      }
    );
  }

  function handleWishlist() {
    if (!user) { router.push("/login"); return; }
    toggleWishlist.mutate(id);
  }

  function toggleAcc(key: string) {
    setOpenAccordion(openAccordion === key ? null : key);
  }

  if (isLoading) {
    return (
      <main style={{ background: "#1C1C1E", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "2.5rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
          }}
        >
          <div style={{ aspectRatio: "3/4", background: "#242426" }} className="animate-pulse" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[30, 60, 20, 80, 40].map((w, i) => (
              <div key={i} style={{ height: "1rem", width: `${w}%`, background: "#242426" }} className="animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ background: "#1C1C1E", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>Product not found.</p>
          <Link href="/categories" style={{ color: "#C9A770", textDecoration: "none", fontSize: "0.85rem" }}>
            Back to Collections →
          </Link>
        </div>
      </main>
    );
  }

  const accordions = [
    { key: "details", title: "Product Details", body: [product.material && `Material: ${product.material}`, product.weight && `Weight: ${product.weight}`, product.pattern && `Pattern: ${product.pattern}`].filter(Boolean).join(". ") || "Premium quality materials. See label for composition details." },
    { key: "care", title: "Care Instructions", body: "Hand wash cold in mild detergent. Do not bleach. Do not tumble dry. Dry flat. Cool iron if needed." },
    { key: "delivery", title: "Delivery & Returns", body: "Standard delivery 3–5 working days. Express available. Free returns within 30 days on all unworn, tagged items." },
  ];

  return (
    <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", fontSize: "0.8rem", flexWrap: "wrap" }}>
          <Link href="/home" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <Link href="/categories" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Collections</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{product.name}</span>
        </nav>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            marginBottom: "5rem",
            alignItems: "start",
          }}
        >
          {/* Images */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div>
            <p style={{ color: "#C9A770", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {product.categoryName ?? "Fashion"}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, lineHeight: 1.2, marginBottom: "1rem", color: "#F0F0F0" }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#C9A770", fontSize: "1.3rem", fontWeight: 600 }}>
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1rem", textDecoration: "line-through" }}>
                    {formatPrice(product.price)}
                  </span>
                  <span style={{ background: "rgba(201,167,112,0.15)", color: "#C9A770", fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.6rem", letterSpacing: "0.1em" }}>
                    SALE
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Colour: <span style={{ color: "#fff" }}>{selectedColor ?? product.colors[0]}</span>
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "0.3rem 0.8rem",
                        border: `1px solid ${selectedColor === color || (!selectedColor && color === product.colors![0]) ? "#C9A770" : "rgba(255,255,255,0.2)"}`,
                        background: "transparent",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Size
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        background: selectedSize === size ? "#C9A770" : "transparent",
                        border: `1px solid ${selectedSize === size ? "#C9A770" : "rgba(255,255,255,0.2)"}`,
                        color: selectedSize === size ? "#1C1C1E" : "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        padding: "0.4rem 0.85rem",
                        fontSize: "0.8rem",
                        fontFamily: "'Inter', sans-serif",
                        transition: "all 0.2s",
                        letterSpacing: "0.05em",
                        fontWeight: selectedSize === size ? 600 : 400,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            {product.stockQty <= 5 && product.stockQty > 0 && (
              <p style={{ color: "#C9A770", fontSize: "0.8rem", marginBottom: "1rem" }}>
                Only {product.stockQty} left in stock
              </p>
            )}

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || product.stockQty === 0}
              style={{
                width: "100%",
                background: addedToCart ? "#4ADE80" : "#C9A770",
                color: "#1C1C1E",
                fontWeight: 700,
                fontSize: "0.85rem",
                padding: "1rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                cursor: product.stockQty === 0 ? "not-allowed" : "pointer",
                marginBottom: "0.75rem",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontFamily: "'Inter', sans-serif",
                opacity: product.stockQty === 0 ? 0.5 : 1,
              }}
            >
              {addedToCart ? <><Check size={16} /> Added to Bag</> : product.stockQty === 0 ? "Out of Stock" : <><ShoppingBag size={16} /> Add to Bag</>}
            </button>

            <button
              onClick={handleWishlist}
              style={{
                width: "100%",
                background: "transparent",
                color: isWishlisted ? "#C9A770" : "rgba(255,255,255,0.5)",
                fontSize: "0.82rem",
                padding: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: `1px solid ${isWishlisted ? "#C9A770" : "rgba(255,255,255,0.14)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Heart size={16} fill={isWishlisted ? "#C9A770" : "none"} />
              {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>

            {/* Accordion */}
            <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {accordions.map(({ key, title, body }) => (
                <div key={key} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <button
                    onClick={() => toggleAcc(key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.9rem 0",
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {title}
                    <span style={{ color: "#C9A770", fontSize: "1.1rem", transition: "transform 0.3s", transform: openAccordion === key ? "rotate(45deg)" : "rotate(0)" }}>
                      +
                    </span>
                  </button>
                  <div
                    className={`acc-body ${openAccordion === key ? "open" : ""}`}
                  >
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", lineHeight: 1.75, paddingBottom: "1rem" }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <div style={{ height: "4.5rem" }} />
      <BottomNav />
    </main>
  );
}
