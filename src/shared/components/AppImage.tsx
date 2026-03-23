"use client";

import { useState } from "react";
import Image from "next/image";

interface AppImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23242426'/%3E%3C/svg%3E";

export function AppImage({
  src,
  alt,
  fill,
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
