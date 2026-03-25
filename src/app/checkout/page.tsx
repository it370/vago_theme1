"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info } from "lucide-react";
import { useCart } from "@/features/cart/queries";
import { usePlaceOrder } from "@/features/orders/queries";
import { useCheckoutNotes } from "@/features/checkout/queries";
import { SellerNotesPanel, SellerNotesPanelSkeleton } from "@/shared/components/SellerNotesPanel";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { BottomNav } from "@/shared/components/BottomNav";
import { AppImage } from "@/shared/components/AppImage";
import { formatPrice } from "@/features/products/normalize";
import type { CartItem, CartSummary } from "@/shared/types";
import { theme } from "@/shared/constants/theme";

/* ── Constants ─────────────────────────────────────────── */

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const ADDRESS_STORAGE_KEY = "vago_address_v2";

/* ── Schema ─────────────────────────────────────────────── */

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number").max(10, "Enter a valid phone number"),
  flatHouse: z.string().min(1, "Flat/House number is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().length(6, "PIN code must be 6 digits"),
  notes: z.string().optional(),
  saveAddress: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

/* ── Main content ───────────────────────────────────────── */

function CheckoutContent() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { mutate: placeOrder, isPending, isError, error } = usePlaceOrder();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { saveAddress: true, state: "" },
  });

  // Restore saved address from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (saved) {
        const addr = JSON.parse(saved) as Partial<FormData>;
        Object.entries(addr).forEach(([k, v]) =>
          setValue(k as keyof FormData, v as string)
        );
      }
    } catch { /* ignore */ }
  }, [setValue]);

  const items = cart?.items ?? [];
  const summary = cart?.summary;
  const total = summary?.subtotalPayable ?? 0;
  const productIds = items.map((i) => i.productId);

  const { data: sellerNotes, isLoading: notesLoading } = useCheckoutNotes(productIds);

  const errorMessage = isError
    ? (() => {
        const e = error as { statusCode?: number; message?: string };
        if (!e.statusCode || e.statusCode >= 500)
          return "We couldn't place your order. Please try again.";
        return e.message ?? "Something went wrong. Please try again.";
      })()
    : null;

  function onSubmit(data: FormData) {
    if (data.saveAddress) {
      try {
        localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(data));
      } catch { /* ignore */ }
    }
    placeOrder(
      {
        address: {
          name: data.name,
          phone: data.phone,
          flatHouse: data.flatHouse,
          street: data.street,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.unitPrice ?? 0,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          productSnapshot: item.product
            ? (item.product as unknown as Record<string, unknown>)
            : null,
        })),
        totalAmount: summary?.subtotalPayable ?? 0,
        notes: data.notes,
      },
      { onSuccess: (order) => router.replace(`/orders/${order.id}`) }
    );
  }

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      {/* Page heading */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ color: theme.accent, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Final Step
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: theme.fg }}>
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="r-checkout-grid">

        {/* ── Address form ────────────────────────────────── */}
        <div>
          <p style={sectionLabelStyle}>Delivery Address</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            <Field label="Full Name" error={errors.name?.message}>
              <input {...register("name")} style={inputStyle} placeholder="John Doe" />
            </Field>

            {/* Phone with +91 prefix */}
            <Field label="Phone Number" error={errors.phone?.message}>
              <div style={{ display: "flex", border: `1px solid ${theme.inputBorder}`, overflow: "hidden", borderRadius: "2px" }}>
                <span style={{ padding: "0.65rem 0.75rem", fontSize: "0.88rem", color: theme.fgMuted, background: theme.elevated, borderRight: `1px solid ${theme.inputBorder}`, whiteSpace: "nowrap" }}>
                  +91
                </span>
                <input
                  {...register("phone")}
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  style={{ ...inputStyle, border: "none", flex: 1 }}
                />
              </div>
            </Field>

            <Field label="Flat / House No." error={errors.flatHouse?.message}>
              <input {...register("flatHouse")} style={inputStyle} placeholder="Flat 4B, Building Name" />
            </Field>

            <Field label="Street / Area" error={errors.street?.message}>
              <input {...register("street")} style={inputStyle} placeholder="Street address, locality" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field label="City" error={errors.city?.message}>
                <input {...register("city")} style={inputStyle} placeholder="Mumbai" />
              </Field>
              <Field label="PIN Code" error={errors.pinCode?.message}>
                <input {...register("pinCode")} type="tel" maxLength={6} style={inputStyle} placeholder="400001" />
              </Field>
            </div>

            {/* State dropdown */}
            <Field label="State" error={errors.state?.message}>
              <select {...register("state")} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Order Notes (optional)">
              <textarea
                {...register("notes")}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Any special instructions for your order…"
              />
            </Field>

            {/* Save address checkbox */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input type="checkbox" {...register("saveAddress")} style={{ width: "1rem", height: "1rem", accentColor: "#C9A770" }} />
              <span style={{ fontSize: "0.82rem", color: theme.fgMuted }}>
                Save address for next time
              </span>
            </label>

            {/* Mobile order summary */}
            <div className="r-checkout-mobile-summary">
              <p style={sectionLabelStyle}>Order Summary</p>
              <OrderSummaryItems items={items} summary={summary} total={total} />
            </div>

            {/* Seller notes */}
            {notesLoading && productIds.length > 0 && <SellerNotesPanelSkeleton />}
            {sellerNotes && <SellerNotesPanel notes={sellerNotes} />}

            {/* No payment banner */}
            <InfoBanner>
              No payment required now. We will contact you to confirm your order.
            </InfoBanner>

            {/* Error banner */}
            {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

            {/* Mobile CTA */}
            <div className="r-checkout-mobile-cta">
              <PlaceOrderButton isPending={isPending} cartLoading={cartLoading} itemCount={items.length} />
            </div>
          </div>
        </div>

        {/* ── Desktop sticky sidebar ────────────────────── */}
        <div className="r-checkout-sidebar">
          <div style={{ background: theme.surface, padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem", border: `1px solid ${theme.border}`, boxShadow: "0 1px 3px rgba(20,20,19,0.05)" }}>
            <p style={sectionLabelStyle}>Your Order</p>

            <OrderSummaryItems items={items} summary={summary} total={total} />

            {/* Seller notes */}
            {notesLoading && productIds.length > 0 && <SellerNotesPanelSkeleton />}
            {sellerNotes && <SellerNotesPanel notes={sellerNotes} />}

            <InfoBanner compact>No payment required now.</InfoBanner>

            {errorMessage && <ErrorBanner compact>{errorMessage}</ErrorBanner>}

            <PlaceOrderButton isPending={isPending} cartLoading={cartLoading} itemCount={items.length} />
          </div>
        </div>
      </form>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function OrderSummaryItems({
  items,
  summary,
  total,
}: {
  items: CartItem[];
  summary?: CartSummary;
  total: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {items.map((item) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Thumbnail */}
          {item.product?.images?.[0] ? (
            <div style={{ position: "relative", width: "3rem", height: "3rem", flexShrink: 0, background: theme.imageBg }}>
              <AppImage
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="48px"
                objectFit="cover"
              />
            </div>
          ) : (
            <div style={{ width: "3rem", height: "3rem", flexShrink: 0, background: theme.imageBg }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.82rem", color: theme.fg, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {item.product?.name ?? "Product"}
            </p>
            <p style={{ fontSize: "0.72rem", color: theme.fgSubtle }}>Qty: {item.quantity}</p>
          </div>
          <p style={{ fontSize: "0.82rem", color: theme.accent, fontWeight: 600, flexShrink: 0 }}>
            {item.lineTotal !== undefined ? formatPrice(item.lineTotal) : "—"}
          </p>
        </div>
      ))}

      {summary && (
        <div style={{ paddingTop: "0.75rem", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: theme.fgMuted }}>Subtotal</span>
            <span style={{ color: theme.fg }}>{formatPrice(summary.subtotalOriginal)}</span>
          </div>
          {summary.totalDiscount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
              <span style={{ color: theme.fgMuted }}>Savings</span>
              <span style={{ color: "#4ADE80" }}>-{formatPrice(summary.totalDiscount)}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: `1px solid ${theme.border}` }}>
        <span style={{ fontWeight: 600, color: theme.fg }}>Total</span>
        <span style={{ fontWeight: 700, fontSize: "1rem", color: theme.accent }}>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

function PlaceOrderButton({
  isPending,
  cartLoading,
  itemCount,
}: {
  isPending: boolean;
  cartLoading: boolean;
  itemCount: number;
}) {
  return (
    <button
      type="submit"
      disabled={isPending || cartLoading || itemCount === 0}
      style={{
        width: "100%",
        background: theme.accent,
        color: theme.onAccent,
        fontWeight: 700,
        fontSize: "0.78rem",
        padding: "0.9rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        border: "none",
        cursor: isPending || cartLoading || itemCount === 0 ? "not-allowed" : "pointer",
        fontFamily: "'Inter', sans-serif",
        opacity: isPending || cartLoading || itemCount === 0 ? 0.65 : 1,
        transition: "opacity 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      {isPending ? (
        <>
          <span
            style={{
              width: "1rem",
              height: "1rem",
              border: `2px solid rgba(28,28,30,0.2)`,
              borderTopColor: theme.onAccent,
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Placing Order…
        </>
      ) : (
        "Place Order"
      )}
    </button>
  );
}

function InfoBanner({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div
      style={{
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: "0.25rem",
        padding: compact ? "0.6rem 0.75rem" : "0.75rem 1rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
      }}
    >
      <Info size={compact ? 13 : 15} style={{ color: "#60A5FA", flexShrink: 0, marginTop: "0.1rem" }} />
      <p style={{ fontSize: compact ? "0.72rem" : "0.78rem", color: "#60A5FA", lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

function ErrorBanner({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: "0.25rem",
        padding: compact ? "0.6rem 0.75rem" : "0.75rem 1rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
      }}
    >
      <Info size={compact ? 13 : 15} style={{ color: "#F87171", flexShrink: 0, marginTop: "0.1rem" }} />
      <p style={{ fontSize: compact ? "0.72rem" : "0.78rem", color: "#F87171", lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label style={{ color: theme.fgMuted, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: "#F87171", fontSize: "0.72rem" }}>{error}</p>}
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: theme.inputBg,
  border: `1px solid ${theme.inputBorder}`,
  color: theme.fg,
  padding: "0.65rem 0.9rem",
  fontSize: "0.88rem",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
};

const sectionLabelStyle: React.CSSProperties = {
  color: theme.fgMuted,
  fontSize: "0.65rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  marginBottom: "1.5rem",
};

/* ── Page export ────────────────────────────────────────── */

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <main style={{ background: theme.bg, minHeight: "100vh" }} className="animate-page-in">
        <CheckoutContent />
        <div className="r-bottom-spacer" />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
