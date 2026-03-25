"use client";

import Link from "next/link";
import { useOrders } from "@/features/orders/queries";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { formatPrice } from "@/features/products/normalize";
import { Package } from "lucide-react";
import { theme } from "@/shared/constants/theme";

function OrdersContent() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: theme.surface, padding: "1.5rem", marginBottom: "1rem" }} className="animate-pulse">
            <div style={{ height: "0.85rem", width: "40%", background: theme.skeletonInner, marginBottom: "0.75rem" }} />
            <div style={{ height: "0.75rem", width: "60%", background: theme.skeletonInner }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: theme.accent, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Purchase History
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: theme.fg }}>
          My Orders
        </h1>
      </div>

      {(!orders || orders.length === 0) ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <Package size={48} style={{ color: theme.fgFaint, margin: "0 auto 1.5rem" }} />
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "0.5rem", color: theme.fg }}>
            No orders yet
          </p>
          <p style={{ color: theme.fgSubtle, fontSize: "0.85rem", marginBottom: "2rem" }}>
            Your purchase history will appear here.
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
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              style={{
                display: "block",
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                padding: "1.5rem",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(201,167,112,0.45)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = theme.border)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: theme.fg, marginBottom: "0.2rem" }}>
                    #{order.orderNumber}
                  </p>
                  <p style={{ color: theme.fgSubtle, fontSize: "0.78rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: theme.fgMuted, fontSize: "0.8rem" }}>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
                <p style={{ color: theme.accent, fontSize: "0.9rem", fontWeight: 600 }}>
                  {formatPrice(order.totalAmount)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <main style={{ background: theme.bg, minHeight: "100vh" }} className="animate-page-in">
        <OrdersContent />
        <Footer />
        <div className="r-bottom-spacer" />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
