"use client";

import type { CSSProperties, MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { useWishlist, useToggleWishlist } from "@/features/wishlist/queries";
import { theme } from "@/shared/constants/theme";

const baseBtnStyle: CSSProperties = {
  position: "absolute",
  top: "0.6rem",
  right: "0.6rem",
  zIndex: 10,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(8px)",
  border: `1px solid ${theme.borderStrong}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.15s",
};

export type ProductWishlistButtonSize = "sm" | "md";

export interface ProductWishlistButtonProps {
  productId: string;
  /** Icon + hit area scale */
  size?: ProductWishlistButtonSize;
  /** Merge with default positioning (e.g. `{ top: '0.5rem', right: '0.5rem' }`) */
  style?: CSSProperties;
  className?: string;
}

const sizeMap: Record<ProductWishlistButtonSize, { box: string; icon: number }> = {
  sm: { box: "1.75rem", icon: 12 },
  md: { box: "2rem", icon: 14 },
};

/**
 * Heart control for product thumbnails — use on any product image overlay.
 * Logged-out users are sent to login on tap; logged-in users toggle via API (optimistic).
 */
export function ProductWishlistButton({
  productId,
  size = "md",
  style,
  className,
}: ProductWishlistButtonProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: wishlist } = useWishlist();
  const { mutate: toggleWishlist } = useToggleWishlist();

  const wishlistIds = wishlist?.productIds ?? [];
  const isInWishlist = wishlistIds.includes(productId);
  const { box, icon } = sizeMap[size];

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleWishlist(productId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        user
          ? isInWishlist
            ? "Remove from wishlist"
            : "Add to wishlist"
          : "Sign in to save to wishlist"
      }
      className={className}
      style={{
        ...baseBtnStyle,
        width: box,
        height: box,
        ...(isInWishlist
          ? { border: `1px solid rgba(201, 167, 112, 0.45)` }
          : {}),
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      <Heart
        size={icon}
        style={{
          color: isInWishlist ? theme.accent : theme.icon,
          fill: isInWishlist ? theme.accent : "none",
          transition: "color 0.2s, fill 0.2s",
        }}
      />
    </button>
  );
}
