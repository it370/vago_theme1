"use client";

import { use } from "react";
import Link from "next/link";
import { useOrder, useCancelOrder } from "@/features/orders/queries";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { formatPrice } from "@/features/products/normalize";
import { AppImage } from "@/shared/components/AppImage";
import { ChevronLeft, MapPin, Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { theme } from "@/shared/constants/theme";
import type { OrderStatus } from "@/shared/types";

/* ── Status timeline ──────────────────────────────────────────────── */
const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: "pending",   label: "Placed",    icon: <Clock size={13} strokeWidth={2} /> },
  { key: "confirmed", label: "Confirmed", icon: <Package size={13} strokeWidth={2} /> },
  { key: "shipped",   label: "Shipped",   icon: <Truck size={13} strokeWidth={2} /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 size={13} strokeWidth={2} /> },
];

const STATUS_ORDER: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
        color: "#F87171", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em",
        textTransform: "uppercase", padding: "0.5rem 1rem",
      }}>
        Order Cancelled
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            {/* Node */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <div style={{
                width: "2rem", height: "2rem",
                borderRadius: "50%",
                background: done ? theme.accent : theme.elevated,
                border: `2px solid ${done ? theme.accent : theme.borderStrong}`,
                color: done ? theme.onAccent : theme.fgFaint,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: active ? `0 0 0 3px rgba(201,167,112,0.18)` : "none",
                transition: "all 0.2s",
                flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: "0.62rem", letterSpacing: "0.06em",
                color: done ? theme.fg : theme.fgFaint,
                fontWeight: active ? 600 : 400,
                whiteSpace: "nowrap",
              }}>
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {i < STATUS_STEPS.length - 1 && (
              <div style={{
                height: "2px", width: "clamp(1.5rem, 4vw, 3.5rem)",
                background: i < currentIdx ? theme.accent : theme.borderStrong,
                marginBottom: "1.1rem", flexShrink: 0,
                transition: "background 0.2s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Thin label / value row for summary ──────────────────────────── */
function SummaryRow({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
      <span style={{ color: theme.fgMuted, fontSize: "0.82rem" }}>{label}</span>
      <span style={{
        fontSize: bold ? "1rem" : "0.82rem",
        fontWeight: bold ? 700 : 500,
        color: accent ? theme.accent : theme.fg,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ── Main content ─────────────────────────────────────────────────── */
function OrderDetailContent({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ height: "1rem", width: "12rem", background: theme.skeleton, marginBottom: "2.5rem" }} className="animate-pulse" />
        <div style={{ height: "7rem", background: theme.skeleton, marginBottom: "1rem" }} className="animate-pulse" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 18rem", gap: "1rem" }}>
          <div style={{ height: "20rem", background: theme.skeleton }} className="animate-pulse" />
          <div style={{ height: "20rem", background: theme.skeleton }} className="animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: theme.fgMuted, marginBottom: "1rem" }}>Order not found.</p>
        <Link href="/orders" style={{ color: theme.accent, textDecoration: "none", fontSize: "0.85rem" }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const totalUnits = order.items.reduce((s, it) => s + it.quantity, 0);
  const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const placedTime = new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2rem 1.5rem 8rem" }}>

      {/* Back link */}
      <Link href="/orders" style={{
        display: "inline-flex", alignItems: "center", gap: "0.2rem",
        color: theme.fgSubtle, textDecoration: "none", fontSize: "0.78rem",
        marginBottom: "2rem", letterSpacing: "0.04em",
      }}>
        <ChevronLeft size={14} /> My Orders
      </Link>

      {/* Invoice header card */}
      <div style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${theme.accent}`,
        padding: "1.75rem 1.75rem 1.5rem",
        marginBottom: "1.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "1.25rem",
      }}>
        <div>
          <p style={{ color: theme.accent, fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Order Invoice
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
            fontWeight: 600,
            color: theme.fg,
            marginBottom: "0.35rem",
            letterSpacing: "-0.01em",
          }}>
            {order.orderNumber}
          </h1>
          <p style={{ color: theme.fgSubtle, fontSize: "0.78rem" }}>
            {placedDate} &nbsp;·&nbsp; {placedTime}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
          <StatusBadge status={order.status} />
          <p style={{ color: theme.fgFaint, fontSize: "0.72rem" }}>
            {totalUnits} unit{totalUnits !== 1 ? "s" : ""} &nbsp;·&nbsp; {order.items.length} line{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Status timeline */}
      <div style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        padding: "1.5rem 1.75rem",
        marginBottom: "1.25rem",
        display: "flex",
        justifyContent: "center",
        overflowX: "auto",
      }}>
        <OrderTimeline status={order.status} />
      </div>

      {/* Two-column body */}
      <div className="r-order-detail-grid">

        {/* Left — items */}
        <div>
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
            <div style={{
              padding: "1rem 1.5rem",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.fgMuted, fontWeight: 600 }}>
                Items Ordered
              </p>
              <p style={{ fontSize: "0.72rem", color: theme.fgFaint }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
            </div>

            <div style={{ padding: "0 1.5rem" }}>
              {order.items.map((item, i) => {
                const snap = item.productSnapshot as Record<string, unknown>;
                const name  = (snap?.name  as string) ?? "Product";
                const image = (snap?.image as string) ?? "";
                const lineTotal = item.priceAtPurchase * item.quantity;

                const tags: { label: string; color?: string }[] = [];
                if (item.selectedPack)  tags.push({ label: item.selectedPack });
                if (item.selectedSize)  tags.push({ label: `Size: ${item.selectedSize}` });
                if (item.selectedColor) tags.push({ label: item.selectedColor });

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      padding: "1.25rem 0",
                      borderBottom: i < order.items.length - 1 ? `1px solid ${theme.border}` : "none",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      flexShrink: 0, width: "5rem", aspectRatio: "3/4",
                      position: "relative", background: theme.imageBg,
                      overflow: "hidden", border: `1px solid ${theme.borderSoft}`,
                    }}>
                      {image ? (
                        <AppImage src={image} alt={name} fill sizes="5rem" objectFit="cover" />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Package size={18} style={{ color: theme.fgFaint }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: "'Playfair Display', serif",
                        color: theme.fg, fontSize: "0.92rem", fontWeight: 500,
                        marginBottom: "0.5rem", lineHeight: 1.35,
                      }}>
                        {name}
                      </p>

                      {tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.6rem" }}>
                          {tags.map((tag) => (
                            <span key={tag.label} style={{
                              fontSize: "0.66rem", letterSpacing: "0.04em",
                              color: theme.accent,
                              background: "rgba(201,167,112,0.08)",
                              border: "1px solid rgba(201,167,112,0.25)",
                              padding: "0.15rem 0.55rem",
                            }}>
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}

                      <p style={{ color: theme.fgSubtle, fontSize: "0.75rem" }}>
                        {formatPrice(item.priceAtPurchase)} &times; {item.quantity}
                      </p>
                    </div>

                    {/* Line total */}
                    <div style={{ flexShrink: 0, textAlign: "right", paddingTop: "0.1rem" }}>
                      <p style={{ color: theme.accent, fontWeight: 700, fontSize: "0.95rem" }}>
                        {formatPrice(lineTotal)}
                      </p>
                      {item.quantity > 1 && (
                        <p style={{ color: theme.fgFaint, fontSize: "0.68rem", marginTop: "0.15rem" }}>
                          {item.quantity} units
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals strip */}
            <div style={{
              borderTop: `1px solid ${theme.border}`,
              padding: "1.25rem 1.5rem",
              background: theme.elevated,
              display: "flex", flexDirection: "column", gap: "0.6rem",
            }}>
              <SummaryRow label="Subtotal" value={formatPrice(order.totalAmount)} />
              <SummaryRow label="Shipping" value="Free" />
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "0.6rem", marginTop: "0.1rem" }}>
                <SummaryRow label="Order Total" value={formatPrice(order.totalAmount)} bold accent />
              </div>
            </div>
          </div>
        </div>

        {/* Right — sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Shipping address */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MapPin size={13} style={{ color: theme.accent, flexShrink: 0 }} />
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.fgMuted, fontWeight: 600 }}>
                Shipping Address
              </p>
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <p style={{ color: theme.fg, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {order.address.name}
              </p>
              <p style={{ color: theme.fgMuted, fontSize: "0.82rem", lineHeight: 1.75 }}>
                {order.address.flatHouse}<br />
                {order.address.street}<br />
                {order.address.city}, {order.address.state}<br />
                {order.address.pinCode}
              </p>
              <p style={{ color: theme.fgSubtle, fontSize: "0.8rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${theme.border}` }}>
                {order.address.phone}
              </p>
            </div>
          </div>

          {/* Order meta */}
          <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: theme.fgMuted, fontWeight: 600, marginBottom: "1rem" }}>
              Order Info
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <SummaryRow label="Order ID" value={order.id.slice(0, 8).toUpperCase()} />
              <SummaryRow label="Placed on" value={placedDate} />
              <SummaryRow label="Items" value={`${totalUnits} unit${totalUnits !== 1 ? "s" : ""}`} />
              <SummaryRow label="Payment" value="Cash on Delivery" />
            </div>
          </div>

          {/* Cancel */}
          {(order.status === "pending" || order.status === "confirmed") && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel this order?")) {
                  cancelOrder.mutate(order.id);
                }
              }}
              disabled={cancelOrder.isPending}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(248,113,113,0.3)",
                color: "#F87171",
                fontSize: "0.78rem",
                padding: "0.8rem",
                cursor: cancelOrder.isPending ? "not-allowed" : "pointer",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
                opacity: cancelOrder.isPending ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {cancelOrder.isPending ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
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
