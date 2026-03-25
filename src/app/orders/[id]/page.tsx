"use client";

import { use } from "react";
import Link from "next/link";
import { useOrder, useCancelOrder } from "@/features/orders/queries";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { formatPrice } from "@/features/products/normalize";
import { ChevronLeft } from "lucide-react";
import { theme } from "@/shared/constants/theme";

function OrderDetailContent({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ height: "2rem", width: "40%", background: theme.skeleton, marginBottom: "2rem" }} className="animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} style={{ height: "5rem", background: theme.skeleton, marginBottom: "1rem" }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: theme.fgMuted }}>Order not found.</p>
        <Link href="/orders" style={{ color: theme.accent, textDecoration: "none", fontSize: "0.85rem" }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      {/* Back */}
      <Link href="/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: theme.fgMuted, textDecoration: "none", fontSize: "0.8rem", marginBottom: "2rem" }}>
        <ChevronLeft size={14} /> Orders
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ color: theme.accent, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Order</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: theme.fg, marginBottom: "0.25rem" }}>
            #{order.orderNumber}
          </h1>
          <p style={{ color: theme.fgSubtle, fontSize: "0.8rem" }}>
            Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <section style={{ background: theme.surface, padding: "1.5rem", marginBottom: "1rem", border: `1px solid ${theme.border}` }}>
        <p style={{ color: theme.fgMuted, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
          Items
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {order.items.map((item, i) => {
            const snap = item.productSnapshot as Record<string, unknown>;
            const name = snap?.name as string ?? "Product";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: i < order.items.length - 1 ? `1px solid ${theme.border}` : "none",
                  gap: "1rem",
                }}
              >
                <div>
                  <p style={{ color: theme.fg, fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.2rem" }}>{name}</p>
                  <p style={{ color: theme.fgSubtle, fontSize: "0.75rem" }}>
                    Qty {item.quantity}
                    {item.selectedSize && ` · Size ${item.selectedSize}`}
                    {item.selectedColor && ` · ${item.selectedColor}`}
                  </p>
                </div>
                <span style={{ color: theme.accent, fontSize: "0.88rem", fontWeight: 600, flexShrink: 0 }}>
                  {formatPrice(item.priceAtPurchase * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "1rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: theme.fg, fontWeight: 600, fontSize: "0.9rem" }}>Total</span>
          <span style={{ color: theme.accent, fontWeight: 700, fontSize: "1rem" }}>
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </section>

      {/* Shipping address */}
      <section style={{ background: theme.surface, padding: "1.5rem", marginBottom: "1rem", border: `1px solid ${theme.border}` }}>
        <p style={{ color: theme.fgMuted, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
          Shipping Address
        </p>
        <p style={{ color: theme.fg, fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.25rem" }}>{order.address.name}</p>
        <p style={{ color: theme.fgMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>
          {order.address.flatHouse}, {order.address.street}<br />
          {order.address.city}, {order.address.state} – {order.address.pinCode}<br />
          {order.address.phone}
        </p>
      </section>

      {/* Cancel */}
      {(order.status === "pending" || order.status === "confirmed") && (
        <button
          onClick={() => {
            if (window.confirm("Cancel this order?")) cancelOrder.mutate(order.id);
          }}
          disabled={cancelOrder.isPending}
          style={{
            background: "transparent",
            border: "1px solid rgba(248,113,113,0.3)",
            color: "#F87171",
            fontSize: "0.8rem",
            padding: "0.7rem 1.5rem",
            cursor: "pointer",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.2s",
          }}
        >
          {cancelOrder.isPending ? "Cancelling…" : "Cancel Order"}
        </button>
      )}
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <main style={{ background: theme.bg, minHeight: "100vh" }} className="animate-page-in">
        <OrderDetailContent id={id} />
        <Footer />
        <div className="r-bottom-spacer" />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
