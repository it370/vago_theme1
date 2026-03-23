"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart, useClearCart } from "@/features/cart/queries";
import { usePlaceOrder } from "@/features/orders/queries";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { BottomNav } from "@/shared/components/BottomNav";
import { formatPrice } from "@/features/products/normalize";
import type { PlaceOrderBody } from "@/shared/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  flatHouse: z.string().min(1, "Flat/House is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z.string().length(6, "Enter 6-digit pin code"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function CheckoutContent() {
  const router = useRouter();
  const { data: cart } = useCart();
  const placeOrder = usePlaceOrder();
  const clearCart = useClearCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  async function onSubmit(data: FormData) {
    if (!cart || items.length === 0) return;

    const body: PlaceOrderBody = {
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
        priceAtPurchase: item.unitPrice ?? item.product?.price ?? 0,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        productSnapshot: item.product ? { name: item.product.name, images: item.product.images } : null,
      })),
      totalAmount: summary?.subtotalPayable ?? 0,
      notes: data.notes,
    };

    const order = await placeOrder.mutateAsync(body);
    clearCart.mutate();
    router.push(`/orders/${order.id}`);
  }

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ color: "#C9A770", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Final Step
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#F0F0F0" }}>
          Checkout
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gridTemplateColumns: "1fr 20rem", gap: "4rem", alignItems: "start" }}
      >
        {/* Address form */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Shipping Address
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Full Name" error={errors.name?.message}>
              <input {...register("name")} style={inputStyle} placeholder="John Doe" />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input {...register("phone")} style={inputStyle} placeholder="9876543210" />
            </Field>
            <Field label="Flat / House No." error={errors.flatHouse?.message} full>
              <input {...register("flatHouse")} style={inputStyle} placeholder="Apt 4B, Building Name" />
            </Field>
            <Field label="Street / Area" error={errors.street?.message} full>
              <input {...register("street")} style={inputStyle} placeholder="MG Road, Sector 12" />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input {...register("city")} style={inputStyle} placeholder="Mumbai" />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <input {...register("state")} style={inputStyle} placeholder="Maharashtra" />
            </Field>
            <Field label="Pin Code" error={errors.pinCode?.message}>
              <input {...register("pinCode")} style={inputStyle} placeholder="400001" maxLength={6} />
            </Field>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <Field label="Order Notes (optional)">
              <textarea
                {...register("notes")}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Any special instructions?"
              />
            </Field>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: "#242426", padding: "1.75rem" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem", color: "#F0F0F0" }}>
            Your Order
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div>
                  <p style={{ color: "#F0F0F0", fontSize: "0.82rem" }}>{item.product?.name ?? "Product"}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>Qty {item.quantity}</p>
                </div>
                <span style={{ color: "#C9A770", fontSize: "0.82rem" }}>
                  {item.lineTotal !== undefined ? formatPrice(item.lineTotal) : "—"}
                </span>
              </div>
            ))}
          </div>

          {summary && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {summary.totalDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Savings</span>
                  <span style={{ color: "#4ADE80", fontSize: "0.8rem" }}>-{formatPrice(summary.totalDiscount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ color: "#F0F0F0", fontWeight: 600 }}>Total</span>
                <span style={{ color: "#C9A770", fontWeight: 700, fontSize: "1rem" }}>
                  {formatPrice(summary.subtotalPayable)}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            style={{
              width: "100%",
              background: "#C9A770",
              color: "#1C1C1E",
              fontWeight: 700,
              fontSize: "0.82rem",
              padding: "0.9rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif",
              opacity: isSubmitting ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isSubmitting ? "Placing Order…" : "Place Order"}
          </button>

          <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", textAlign: "center" }}>
            Cash on delivery. No payment required now.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label
        style={{
          display: "block",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color: "#F87171", fontSize: "0.72rem", marginTop: "0.25rem" }}>{error}</p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  padding: "0.65rem 0.9rem",
  fontSize: "0.88rem",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  boxSizing: "border-box",
};

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">
        <CheckoutContent />
        <div style={{ height: "4.5rem" }} />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
