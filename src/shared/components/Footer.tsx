import Link from "next/link";
import { APP_NAME } from "@/shared/constants/app";

export function Footer() {
  return (
    <footer
      style={{
        background: "#1C1C1E",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "4rem 1.5rem 3rem",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.2rem",
                letterSpacing: "0.25em",
                color: "#C9A770",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              {APP_NAME}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "0.8rem",
                lineHeight: 1.7,
              }}
            >
              Crafted for the discerning individual. Every piece, a statement.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p style={colHeadStyle}>Shop</p>
            <ul style={listStyle}>
              <li><FooterLink href="/categories">New Arrivals</FooterLink></li>
              <li><FooterLink href="/categories">Women</FooterLink></li>
              <li><FooterLink href="/categories">Accessories</FooterLink></li>
              <li><FooterLink href="/search?q=sale">Sale</FooterLink></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p style={colHeadStyle}>Help</p>
            <ul style={listStyle}>
              <li><FooterLink href="#">Sizing Guide</FooterLink></li>
              <li><FooterLink href="#">Shipping & Returns</FooterLink></li>
              <li><FooterLink href="#">Contact Us</FooterLink></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p style={colHeadStyle}>Account</p>
            <ul style={listStyle}>
              <li><FooterLink href="/login">Sign In</FooterLink></li>
              <li><FooterLink href="/orders">My Orders</FooterLink></li>
              <li><FooterLink href="/wishlist">Wishlist</FooterLink></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            Made with care.
          </p>
        </div>
      </div>
    </footer>
  );
}

const colHeadStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "0.65rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  fontWeight: 600,
  marginBottom: "1rem",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.55rem",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
}
