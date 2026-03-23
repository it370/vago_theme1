"use client";

import { useState } from "react";
import Image from "next/image";

interface AppImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  /**
   * Passed directly to Next.js Image for responsive sizing hints.
   * Required when fill=true — default covers the most common layouts.
   */
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

const FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23242426'/%3E%3C/svg%3E";

/**
 * Default sizes hint for fill images:
 * - Mobile  (< 640px)  → 100vw
 * - Tablet  (< 1024px) → 50vw  (two-column grids)
 * - Desktop            → 25vw  (four-column product grids)
 * Callers can override via the sizes prop for specific contexts.
 */
const DEFAULT_FILL_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

export function AppImage({
  src,
  alt,
  fill,
  sizes,
  width,
  height,
  className,
  style,
  priority,
  objectFit = "cover",
}: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={fill ? (sizes ?? DEFAULT_FILL_SIZES) : undefined}
      width={!fill ? (width ?? 400) : undefined}
      height={!fill ? (height ?? 400) : undefined}
      className={className}
      style={{ objectFit, ...style }}
      priority={priority}
      onError={() => setImgSrc(FALLBACK)}
      unoptimized={imgSrc.startsWith("data:")}
    />
  );
}
