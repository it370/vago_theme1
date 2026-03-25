"use client";

import { useState } from "react";
import { AppImage } from "./AppImage";
import { theme } from "@/shared/constants/theme";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbs = images.length > 0 ? images : [""];

  return (
    <div>
      {/* Main image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          background: theme.imageBg,
          marginBottom: "0.75rem",
          overflow: "hidden",
        }}
      >
        <AppImage
          src={thumbs[activeIndex]}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          objectFit="cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {thumbs.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(thumbs.length, 4)}, 1fr)`,
            gap: "0.5rem",
          }}
        >
          {thumbs.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                aspectRatio: "3/4",
                position: "relative",
                border: `2px solid ${i === activeIndex ? theme.accent : "transparent"}`,
                background: theme.imageBg,
                cursor: "pointer",
                padding: 0,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <AppImage
                src={img}
                alt={`${productName} ${i + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 12vw"
                objectFit="cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
