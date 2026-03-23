import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import { useAuthStore } from "@/features/auth/store";
import type { WishlistResponse } from "@/shared/types";
import { normalizeWishlistResponse } from "@/features/products/normalize";

export const wishlistKeys = {
  all: ["wishlist"] as const,
};

export function useWishlist() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: async () =>
      normalizeWishlistResponse(
        await ApiService.get<WishlistResponse>("/api/wishlist", { auth: true })
      ),
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
      ApiService.post<{ action: "added" | "removed" }>("/api/wishlist", {
        auth: true,
        body: { productId },
      }),
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: wishlistKeys.all });
      const prev = qc.getQueryData<WishlistResponse>(wishlistKeys.all);
      qc.setQueryData<WishlistResponse>(wishlistKeys.all, (old) => {
        if (!old) return old;
        const isIn = old.productIds.includes(productId);
        return {
          ...old,
          productIds: isIn
            ? old.productIds.filter((id) => id !== productId)
            : [...old.productIds, productId],
          products: isIn
            ? old.products.filter((p) => p.id !== productId)
            : old.products,
        };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(wishlistKeys.all, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}
