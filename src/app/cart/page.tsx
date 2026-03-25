"use client";

import Link from "next/link";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/features/cart/queries";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { AppImage } from "@/shared/components/AppImage";
import { formatPrice } from "@/features/products/normalize";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { theme } from "@/shared/constants/theme";

function CartContent() {
  const { data: cart, isLoading } = useCart();
  const removeItem = useRemoveCartItem();
  const updateItem = useUpdateCartItem();

  if (isLoading) {
    return (
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ width: "6rem", aspectRatio: "3/4", background: theme.skeleton }} className="animate-pulse" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center" }}>
              <div style={{ height: "0.85rem", width: "60%", background: theme.skeleton }} className="animate-pulse" />
              <div style={{ height: "0.75rem", width: "30%", background: theme.skeleton }} className="animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ color: theme.accent, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Your Selection
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: theme.fg }}>
          Shopping Bag
        </h1>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <ShoppingBag size={48} style={{ color: theme.fgFaint, margin: "0 auto 1.5rem" }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "0.5rem", color: theme.fg }}>
            Your bag is empty
          </p>
          <p style={{ color: theme.fgSubtle, fontSize: "0.85rem", marginBottom: "2rem" }}>
            Explore our collection and add pieces you love.
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
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="r-cart-grid">
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  padding: "1.5rem 0",
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                {/* Image */}
                <Link href={`/product/${item.productId}`} style={{ flexShrink: 0 }}>
                  <div style={{ width: "6rem", aspectRatio: "3/4", position: "relative", background: theme.imageBg, overflow: "hidden" }}>
                    {item.product?.images?.[0] && (
                      <AppImage
                        src={item.product.images[0]}
                        alt={item.product.name ?? "Product"}
                        fill
                        sizes="6rem"
                        objectFit="cover"
                      />
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ color: theme.accent, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    {item.product?.categoryName}
                  </p>
                  <Link
                    href={`/product/${item.productId}`}
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 500, color: theme.fg, textDecoration: "none", display: "block", marginBottom: "0.25rem" }}
                  >
                    {item.product?.name ?? "Product"}
                  </Link>
                  {item.selectedSize && (
                    <p style={{ color: theme.fgMuted, fontSize: "0.75rem" }}>Size: {item.selectedSize}</p>
                  )}
                  {item.selectedColor && (
                    <p style={{ color: theme.fgMuted, fontSize: "0.75rem" }}>Colour: {item.selectedColor}</p>
                  )}
                  {item.selectedPack && (
                    <p style={{ color: theme.fgMuted, fontSize: "0.75rem" }}>Pack: {item.selectedPack}</p>
                  )}

                  <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {/* Qty control */}
                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${theme.borderStrong}`, gap: 0 }}>
                      <button
                        onClick={() => {
                          if (item.quantity > 1) updateItem.mutate({ id: item.id, quantity: item.quantity - 1 });
                          else removeItem.mutate(item.id);
                        }}
                        style={{ background: "none", border: "none", color: theme.fgMuted, cursor: "pointer", padding: "0.3rem 0.6rem", display: "flex" }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ color: theme.fg, fontSize: "0.85rem", padding: "0 0.5rem", minWidth: "1.5rem", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        style={{ background: "none", border: "none", color: theme.fgMuted, cursor: "pointer", padding: "0.3rem 0.6rem", display: "flex" }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      style={{ background: "none", border: "none", color: theme.fgFaint, cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ color: theme.accent, fontSize: "0.9rem", fontWeight: 600 }}>
                    {item.lineTotal !== undefined ? formatPrice(item.lineTotal) : item.product ? formatPrice((item.product.salePrice ?? item.product.price) * item.quantity) : "—"}
                  </p>
                  {item.lineSaving != null && item.lineSaving > 0 && (
                    <p style={{ color: theme.fgFaint, fontSize: "0.7rem" }}>Save {formatPrice(item.lineSaving)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {summary && (
            <div className="r-cart-summary" style={{ background: theme.surface, padding: "1.75rem", flexShrink: 0, border: `1px solid ${theme.border}`, boxShadow: "0 1px 2px rgba(20,20,19,0.04)" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem", color: theme.fg }}>
                Order Summary
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Row label="Subtotal" value={formatPrice(summary.subtotalOriginal)} />
                {summary.totalDiscount > 0 && (
                  <Row label="Discount" value={`-${formatPrice(summary.totalDiscount)}`} valueColor="#4ADE80" />
                )}
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "0.75rem" }}>
                  <Row label="Total" value={formatPrice(summary.subtotalPayable)} bold />
                </div>
              </div>
              <Link
                href="/checkout"
                style={{
                  display: "block",
                  width: "100%",
                  background: theme.accent,
                  color: theme.onAccent,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  padding: "0.9rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  textAlign: "center",
                  marginBottom: "0.75rem",
                }}
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/categories"
                style={{
                  display: "block",
                  textAlign: "center",
                  color: theme.fgMuted,
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  letterSpacing: "0.08em",
                }}
              >
                Continue Shopping →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold, valueColor }: { label: string; value: string; bold?: boolean; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: bold ? theme.fg : theme.fgMuted, fontSize: "0.85rem", fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ color: valueColor ?? (bold ? theme.accent : theme.fg), fontSize: "0.85rem", fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <main style={{ background: theme.bg, minHeight: "100vh" }} className="animate-page-in">
        <CartContent />
        <Footer />
        <div className="r-bottom-spacer" />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
