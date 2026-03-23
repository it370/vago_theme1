"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/shared/types";
import { formatPrice } from "@/features/products/normalize";
import { AppImage } from "./AppImage";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const displayImage = product.images?.[0] ?? "";
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;

  return (
    <Link
      href={`/product/${product.id}`}
      className="product-card block"
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — 3:4 portrait */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#242426",
          aspectRatio: "3/4",
          marginBottom: "0.75rem",
        }}
      >
        {displayImage ? (
          <AppImage
            src={displayImage}
            alt={product.name}
            fill
            className="product-img"
            objectFit="cover"
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#242426",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.75rem" }}>
              No image
            </span>
          </div>
        )}

        {/* Badge */}
        {hasDiscount && (
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              background: "#C9A770",
              color: "#1C1C1E",
              fontSize: "0.6rem",
              fontWeight: 700,
              padding: "0.2rem 0.5rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            SALE
          </div>
        )}

        {/* Hover overlay — frosted glass bar (luxury fashion style) */}
        <div
          className="hover-reveal"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: "0.7rem",
              padding: "0.5rem 1.25rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            View Product
          </span>
        </div>
      </div>

      {/* Category */}
      {product.categoryName && (
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "0.25rem",
          }}
        >
          {product.categoryName}
        </p>
      )}

      {/* Name */}
      <h4
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "0.85rem",
          fontWeight: 500,
          marginBottom: "0.35rem",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {product.name}
      </h4>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: "#C9A770", fontSize: "0.85rem", fontWeight: 600 }}>
          {formatPrice(effectivePrice)}
        </span>
        {hasDiscount && (
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.75rem",
              textDecoration: "line-through",
            }}
          >
            {formatPrice(product.price)}
          </span>
        )}
      </div>
    </Link>
  );
}
