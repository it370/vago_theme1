"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, ShoppingBag, Heart, User } from "lucide-react";
import { useCartCount } from "@/features/cart/queries";

const navItems = [
  { href: "/home",       Icon: Home,        label: "Home" },
  { href: "/categories", Icon: Grid3x3,     label: "Shop" },
  { href: "/cart",       Icon: ShoppingBag, label: "Cart" },
  { href: "/wishlist",   Icon: Heart,       label: "Saved" },
  { href: "/profile",    Icon: User,        label: "Me" },
];

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(28,28,30,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        padding: "0.5rem 0 env(safe-area-inset-bottom, 0.5rem)",
      }}
    >
      {navItems.map(({ href, Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        const isCart = href === "/cart";
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
              color: active ? "#C9A770" : "rgba(255,255,255,0.4)",
              textDecoration: "none",
              padding: "0.4rem 0",
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              {isCart && cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-7px",
                    background: "#C9A770",
                    color: "#1C1C1E",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    minWidth: "0.9rem",
                    height: "0.9rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.05em" }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
