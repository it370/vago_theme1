"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useProduct, useProducts } from "@/features/products/queries";
import { useNewArrivals } from "@/features/home/queries";
import { useAddToCart } from "@/features/cart/queries";
import { useToggleWishlist, useWishlistProductIds } from "@/features/wishlist/queries";
import { useAuthStore } from "@/features/auth/store";
import { ImageGallery } from "@/shared/components/ImageGallery";
import { ProductGrid } from "@/shared/components/ProductGrid";
import { AppImage } from "@/shared/components/AppImage";
import { ProductWishlistButton } from "@/shared/components/ProductWishlistButton";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { formatPrice } from "@/features/products/normalize";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Check, Zap } from "lucide-react";
import { theme } from "@/shared/constants/theme";

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

  const { data: categoryProducts, isLoading: similarLoading } = useProducts({
    categoryId: product?.categoryId,
    enabled: !!product?.categoryId,
  });
  const similarProducts = categoryProducts?.filter((p) => p.id !== id).slice(0, 8);

  const { data: newArrivals } = useNewArrivals();
  // Hot Deals ad strip — data source is swappable; currently new arrivals
  const hotDeals = newArrivals?.products?.slice(0, 10) ?? [];

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
      <main style={{ background: theme.bg, minHeight: "100vh" }}>
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
          <div style={{ aspectRatio: "3/4", background: theme.skeleton }} className="animate-pulse" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[30, 60, 20, 80, 40].map((w, i) => (
              <div key={i} style={{ height: "1rem", width: `${w}%`, background: theme.skeleton }} className="animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main style={{ background: theme.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: theme.fgMuted, marginBottom: "1rem" }}>Product not found.</p>
          <Link href="/categories" style={{ color: theme.accent, textDecoration: "none", fontSize: "0.85rem" }}>
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
    <main style={{ background: theme.bg, minHeight: "100vh" }} className="animate-page-in">
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem", fontSize: "0.8rem", flexWrap: "wrap" }}>
          <Link href="/home" style={{ color: theme.fgSubtle, textDecoration: "none" }}>Home</Link>
          <span style={{ color: theme.fgFaint }}>›</span>
          <Link href="/categories" style={{ color: theme.fgSubtle, textDecoration: "none" }}>Collections</Link>
          <span style={{ color: theme.fgFaint }}>›</span>
          <span style={{ color: theme.fg }}>{product.name}</span>
        </nav>

        {/* Layout — 2-col desktop / 1-col mobile */}
        <div className="r-pdp-grid">
          {/* Images */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div>
            <p style={{ color: theme.accent, fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {product.categoryName ?? "Fashion"}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600, lineHeight: 1.2, marginBottom: "1rem", color: theme.fg }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.accent, fontSize: "1.3rem", fontWeight: 600 }}>
                {formatPrice(effectivePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ color: theme.fgFaint, fontSize: "1rem", textDecoration: "line-through" }}>
                    {formatPrice(product.price)}
                  </span>
                  <span style={{ background: "rgba(201,167,112,0.15)", color: theme.accent, fontSize: "0.65rem", fontWeight: 600, padding: "0.2rem 0.6rem", letterSpacing: "0.1em" }}>
                    SALE
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: theme.fgMuted, fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.75rem", color: theme.fgMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Colour: <span style={{ color: theme.fg }}>{selectedColor ?? product.colors[0]}</span>
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "0.3rem 0.8rem",
                        border: `1px solid ${selectedColor === color || (!selectedColor && color === product.colors![0]) ? theme.accent : theme.borderStrong}`,
                        background: "transparent",
                        color: theme.fg,
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
                <p style={{ fontSize: "0.75rem", color: theme.fgMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  Size
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        background: selectedSize === size ? theme.accent : "transparent",
                        border: `1px solid ${selectedSize === size ? theme.accent : theme.borderStrong}`,
                        color: selectedSize === size ? theme.onAccent : theme.fgMuted,
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
              <p style={{ color: theme.accent, fontSize: "0.8rem", marginBottom: "1rem" }}>
                Only {product.stockQty} left in stock
              </p>
            )}

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || product.stockQty === 0}
              style={{
                width: "100%",
                background: addedToCart ? "#4ADE80" : theme.accent,
                color: theme.onAccent,
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
                color: isWishlisted ? theme.accent : theme.fgMuted,
                fontSize: "0.82rem",
                padding: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: `1px solid ${isWishlisted ? theme.accent : theme.borderStrong}`,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Heart size={16} fill={isWishlisted ? theme.accent : "none"} />
              {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>

            {/* Accordion */}
            <div style={{ marginTop: "2rem", borderTop: `1px solid ${theme.border}` }}>
              {accordions.map(({ key, title, body }) => (
                <div key={key} style={{ borderBottom: `1px solid ${theme.border}` }}>
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
                      color: theme.fg,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {title}
                    <span style={{ color: theme.accent, fontSize: "1.1rem", transition: "transform 0.3s", transform: openAccordion === key ? "rotate(45deg)" : "rotate(0)" }}>
                      +
                    </span>
                  </button>
                  <div
                    className={`acc-body ${openAccordion === key ? "open" : ""}`}
                  >
                    <p style={{ color: theme.fgMuted, fontSize: "0.82rem", lineHeight: 1.75, paddingBottom: "1rem" }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {(similarLoading || (similarProducts && similarProducts.length > 0)) && (
        <section
          style={{
            borderTop: `1px solid ${theme.border}`,
            padding: "4rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <p
                style={{
                  color: theme.accent,
                  fontSize: "0.65rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                {product.categoryName ?? "More from the collection"}
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 600,
                  color: theme.fg,
                }}
              >
                You May Also Like
              </h2>
            </div>
            <ProductGrid
              products={similarProducts}
              isLoading={similarLoading}
              skeletonCount={4}
              emptyMessage="No similar products found."
            />
          </div>
        </section>
      )}

      {/* Hot Deals — featured ad strip */}
      {hotDeals.length > 0 && (
        <section style={{ position: "relative", overflow: "hidden", background: theme.surface, padding: "5rem 0 4rem", borderTop: `1px solid ${theme.border}` }}>
          {/* Gold aurora — bleeds from top centre */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              height: "260px",
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(201,167,112,0.13) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Ghost watermark */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(5rem, 14vw, 11rem)",
              fontWeight: 700,
              color: "rgba(201,167,112,0.038)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
              letterSpacing: "0.06em",
            }}
          >
            HOT DEALS
          </div>

          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3rem",
              background: "linear-gradient(to bottom, transparent, rgba(247,246,243,0.9))",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
            {/* Left-aligned editorial header */}
            <div style={{ marginBottom: "2.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.9rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    background: "rgba(201,167,112,0.1)",
                    border: "1px solid rgba(201,167,112,0.35)",
                    color: theme.accent,
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    padding: "0.28rem 0.75rem",
                    borderRadius: "2px",
                  }}
                >
                  <Zap size={9} strokeWidth={2.5} />
                  Featured Picks
                </span>
                <Link
                  href="/new-arrivals"
                  style={{
                    color: "rgba(201,167,112,0.65)",
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(201,167,112,0.2)",
                    paddingBottom: "0.15rem",
                  }}
                >
                  View All →
                </Link>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 600,
                  color: theme.fg,
                  lineHeight: 1.15,
                  marginBottom: "0.85rem",
                }}
              >
                Hot Deals
              </h2>
              {/* Gold rule — left-anchored below heading */}
              <div style={{ width: "2.5rem", height: "1px", background: "linear-gradient(90deg, #C9A770, transparent)" }} />
            </div>

            {/* Horizontal scroll track */}
            <div
              className="hot-deals-scroll"
              style={{
                display: "flex",
                gap: "1rem",
                overflowX: "auto",
                paddingBottom: "0.5rem",
                scrollbarWidth: "none",
              }}
            >
              {hotDeals.map((deal) => {
                const dealImg = deal.images?.[0] ?? "";
                const dealPrice = deal.salePrice ?? deal.price;
                const dealHasDiscount = !!deal.salePrice && deal.salePrice < deal.price;
                return (
                  <Link
                    key={deal.id}
                    href={`/product/${deal.id}`}
                    style={{ textDecoration: "none", color: "inherit", flexShrink: 0, width: "160px" }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        background: theme.imageBg,
                        aspectRatio: "3/4",
                        marginBottom: "0.6rem",
                        border: `1px solid ${theme.borderSoft}`,
                      }}
                    >
                      {dealImg ? (
                        <AppImage
                          src={dealImg}
                          alt={deal.name}
                          fill
                          sizes="160px"
                          className="product-img"
                          objectFit="cover"
                        />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: theme.fgFaint, fontSize: "0.65rem" }}>No image</span>
                        </div>
                      )}

                      {dealHasDiscount && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "0.5rem",
                            background: theme.accent,
                            color: theme.onAccent,
                            fontSize: "0.55rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.4rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          SALE
                        </div>
                      )}

                      <ProductWishlistButton productId={deal.id} size="sm" />
                    </div>

                    {/* Info */}
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        color: theme.fg,
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.4,
                      }}
                    >
                      {deal.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ color: theme.accent, fontSize: "0.78rem", fontWeight: 600 }}>
                        {formatPrice(dealPrice)}
                      </span>
                      {dealHasDiscount && (
                        <span style={{ color: theme.fgFaint, fontSize: "0.68rem", textDecoration: "line-through" }}>
                          {formatPrice(deal.price)}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>
      )}

      <Footer />
      <div className="r-bottom-spacer" />
      <BottomNav />
    </main>
  );
}
