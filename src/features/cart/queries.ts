import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import { useAuthStore } from "@/features/auth/store";
import type { CartResponse } from "@/shared/types";
import { normalizeCartResponse } from "@/features/products/normalize";

export const cartKeys = { all: ["cart"] as const };

export function useCart() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: async () =>
      normalizeCartResponse(
        await ApiService.get<CartResponse>("/api/cart", { auth: true })
      ),
    enabled: !!user,
  });
}

export function useCartCount() {
  const { data } = useCart();
  return data?.summary.itemCount ?? 0;
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      productId: string;
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
    }) => ApiService.post("/api/cart", { auth: true, body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      ApiService.patch(`/api/cart/${id}`, { auth: true, body: { quantity } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ApiService.delete(`/api/cart/${id}`, { auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ApiService.delete("/api/cart", { auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.all }),
  });
}
