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

function OrderDetailContent({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ height: "2rem", width: "40%", background: "#242426", marginBottom: "2rem" }} className="animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} style={{ height: "5rem", background: "#242426", marginBottom: "1rem" }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Order not found.</p>
        <Link href="/orders" style={{ color: "#C9A770", textDecoration: "none", fontSize: "0.85rem" }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      {/* Back */}
      <Link href="/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.8rem", marginBottom: "2rem" }}>
        <ChevronLeft size={14} /> Orders
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ color: "#C9A770", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Order</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#F0F0F0", marginBottom: "0.25rem" }}>
            #{order.orderNumber}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
            Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <section style={{ background: "#242426", padding: "1.5rem", marginBottom: "1rem" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
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
                  borderBottom: i < order.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  gap: "1rem",
                }}
              >
                <div>
                  <p style={{ color: "#F0F0F0", fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.2rem" }}>{name}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
                    Qty {item.quantity}
                    {item.selectedSize && ` · Size ${item.selectedSize}`}
                    {item.selectedColor && ` · ${item.selectedColor}`}
                  </p>
                </div>
                <span style={{ color: "#C9A770", fontSize: "0.88rem", fontWeight: 600, flexShrink: 0 }}>
                  {formatPrice(item.priceAtPurchase * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#F0F0F0", fontWeight: 600, fontSize: "0.9rem" }}>Total</span>
          <span style={{ color: "#C9A770", fontWeight: 700, fontSize: "1rem" }}>
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </section>

      {/* Shipping address */}
      <section style={{ background: "#242426", padding: "1.5rem", marginBottom: "1rem" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
          Shipping Address
        </p>
        <p style={{ color: "#F0F0F0", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.25rem" }}>{order.address.name}</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.6 }}>
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
      <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">
        <OrderDetailContent id={id} />
        <Footer />
        <div style={{ height: "4.5rem" }} />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
