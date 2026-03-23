import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import { useAuthStore } from "@/features/auth/store";
import type { WishlistResponse } from "@/shared/types";

export const wishlistKeys = { all: ["wishlist"] as const };

export function useWishlist() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: () => ApiService.get<WishlistResponse>("/api/wishlist", { auth: true }),
    enabled: !!user,
  });
}

export function useWishlistProductIds() {
  const { data } = useWishlist();
  return data?.productIds ?? [];
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      ApiService.post("/api/wishlist", { auth: true, body: { productId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}
