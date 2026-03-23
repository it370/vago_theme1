"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/firebase";
import { useAuthStore } from "@/features/auth/store";
import { useOrders } from "@/features/orders/queries";
import { useWishlist } from "@/features/wishlist/queries";
import { useCart } from "@/features/cart/queries";
import { AuthGuard } from "@/shared/components/AuthGuard";
import { Footer } from "@/shared/components/Footer";
import { BottomNav } from "@/shared/components/BottomNav";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatPrice } from "@/features/products/normalize";
import { Package, Heart, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import { AppImage } from "@/shared/components/AppImage";

function ProfileContent() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: orders } = useOrders();
  const { data: wishlist } = useWishlist();
  const { data: cart } = useCart();

  async function handleSignOut() {
    await signOut();
    router.replace("/home");
  }

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "2.5rem 1.5rem 8rem" }}>
      {/* User info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
          marginBottom: "3rem",
          padding: "1.75rem",
          background: "#242426",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {user?.photoURL ? (
          <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
            <AppImage src={user.photoURL} alt={user.displayName ?? "User"} fill sizes="4rem" objectFit="cover" />
          </div>
        ) : (
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              background: "rgba(201,167,112,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#C9A770", fontSize: "1.4rem", fontFamily: "'Playfair Display', serif" }}>
              {(user?.displayName ?? user?.email ?? "U")[0].toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#F0F0F0", marginBottom: "0.2rem" }}>
            {user?.displayName ?? "Valued Customer"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
        <StatCard icon={<Package size={20} />} label="Orders" value={orders?.length ?? 0} href="/orders" />
        <StatCard icon={<Heart size={20} />} label="Saved" value={wishlist?.productIds.length ?? 0} href="/wishlist" />
        <StatCard icon={<ShoppingBag size={20} />} label="In Bag" value={cart?.summary.itemCount ?? 0} href="/cart" />
      </div>

      {/* Recent orders */}
      {orders && orders.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Recent Orders
            </p>
            <Link href="/orders" style={{ color: "#C9A770", fontSize: "0.75rem", textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.25rem",
                  background: "#242426",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                }}
              >
                <div>
                  <p style={{ color: "#F0F0F0", fontSize: "0.85rem", fontWeight: 500, marginBottom: "0.2rem" }}>
                    #{order.orderNumber}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <StatusBadge status={order.status} />
                  <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "transparent",
          border: "1px solid rgba(248,113,113,0.25)",
          color: "#F87171",
          fontSize: "0.82rem",
          padding: "0.75rem 1.25rem",
          cursor: "pointer",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        padding: "1.25rem",
        background: "#242426",
        border: "1px solid rgba(255,255,255,0.06)",
        textDecoration: "none",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(201,167,112,0.3)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)")}
    >
      <span style={{ color: "#C9A770" }}>{icon}</span>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#F0F0F0" }}>
        {value}
      </span>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </Link>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <main style={{ background: "#1C1C1E", minHeight: "100vh" }} className="animate-page-in">
        <ProfileContent />
        <Footer />
        <div style={{ height: "4.5rem" }} />
        <BottomNav />
      </main>
    </AuthGuard>
  );
}
