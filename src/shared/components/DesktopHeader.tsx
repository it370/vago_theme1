"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCartCount } from "@/features/cart/queries";
import { useAuthStore } from "@/features/auth/store";
import { APP_NAME } from "@/shared/constants/app";

export function DesktopHeader() {
  const cartCount = useCartCount();
  const { user } = useAuthStore();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  }

  return (
    <>
      {/* Ticker bar */}
      <div
        style={{
          background: "#C9A770",
          color: "#1C1C1E",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          padding: "0.45rem 0",
          overflow: "hidden",
        }}
      >
        <div className="ticker-track">
          <span style={{ padding: "0 3rem" }}>✦ New Collection Available Now</span>
          <span style={{ padding: "0 3rem" }}>✦ Free Shipping on Orders Above ₹2,500</span>
          <span style={{ padding: "0 3rem" }}>✦ Members Receive Early Access</span>
          <span style={{ padding: "0 3rem" }}>✦ New Collection Available Now</span>
          <span style={{ padding: "0 3rem" }}>✦ Free Shipping on Orders Above ₹2,500</span>
          <span style={{ padding: "0 3rem" }}>✦ Members Receive Early Access</span>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(28,28,30,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "4rem",
            position: "relative",
          }}
        >
          {/* Left nav */}
          <div style={{ display: "flex", gap: "1.75rem" }}>
            <NavLink href="/categories">Collections</NavLink>
            <NavLink href="/categories">New Arrivals</NavLink>
            <NavLink href="/search?q=sale">Sale</NavLink>
          </div>

          {/* Center brand */}
          <Link
            href="/home"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              letterSpacing: "0.3em",
              color: "#C9A770",
              fontWeight: 700,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              textDecoration: "none",
            }}
          >
            {APP_NAME}
          </Link>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={iconBtnStyle}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <Link href="/wishlist" style={iconBtnStyle} aria-label="Wishlist">
              <Heart size={18} />
            </Link>

            <Link
              href="/cart"
              style={{ ...iconBtnStyle, position: "relative" }}
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "#C9A770",
                    color: "#1C1C1E",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            <Link
              href={user ? "/profile" : "/login"}
              style={iconBtnStyle}
              aria-label="Account"
            >
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            style={{
              padding: "0.75rem 1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(28,28,30,0.98)",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              autoFocus
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search products…"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                padding: "0.6rem 1rem",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#C9A770",
                color: "#1C1C1E",
                border: "none",
                padding: "0.6rem 1.25rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Search
            </button>
          </form>
        )}
      </nav>
    </>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "rgba(255,255,255,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  textDecoration: "none",
  transition: "color 0.2s",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: "rgba(255,255,255,0.6)",
        fontSize: "0.7rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#C9A770")}
      onMouseLeave={(e) =>
        ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")
      }
    >
      {children}
    </Link>
  );
}
