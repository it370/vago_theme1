"use client";

import Link from "next/link";
import type { Product } from "@/shared/types";
import { formatPrice } from "@/features/products/normalize";
import { AppImage } from "./AppImage";
import { ProductWishlistButton } from "./ProductWishlistButton";
import { theme } from "@/shared/constants/theme";

interface ProductRowCardProps {
  product: Product;
}

export function ProductRowCard({ product }: ProductRowCardProps) {
  const displayImage = product.images?.[0] ?? "";
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;

  return (
    <Link
      href={`/product/${product.id}`}
      className="product-row-card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: "var(--row-card-img-w, 110px)",
          aspectRatio: "3/4",
          overflow: "hidden",
          background: theme.imageBg,
          border: `1px solid ${theme.borderSoft}`,
        }}
      >
        {displayImage ? (
          <AppImage
            src={displayImage}
            alt={product.name}
            fill
            sizes="110px"
            className="product-img"
            objectFit="cover"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: theme.fgFaint, fontSize: "0.65rem" }}>
              No image
            </span>
          </div>
        )}

        {hasDiscount && (
          <div
            style={{
              position: "absolute",
              top: "0.4rem",
              left: "0.4rem",
              background: theme.accent,
              color: theme.onAccent,
              fontSize: "0.52rem",
              fontWeight: 700,
              padding: "0.12rem 0.35rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SALE
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.3rem" }}>
        {product.categoryName && (
          <p
            style={{
              color: theme.accent,
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            {product.categoryName}
          </p>
        )}

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.88rem, 2vw, 1rem)",
            fontWeight: 500,
            color: theme.fg,
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p
            style={{
              fontSize: "0.75rem",
              color: theme.fgMuted,
              lineHeight: 1.6,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.description}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.25rem" }}>
          <span style={{ color: theme.accent, fontSize: "0.88rem", fontWeight: 600 }}>
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span
              style={{
                color: theme.fgFaint,
                fontSize: "0.75rem",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Wishlist — absolute positioned to card top-right */}
      <div style={{ flexShrink: 0, alignSelf: "center" }}>
        <ProductWishlistButton
          productId={product.id}
          size="sm"
          style={{ position: "static", width: "1.85rem", height: "1.85rem" }}
        />
      </div>
    </Link>
  );
}
