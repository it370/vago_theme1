import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import { useAuthStore } from "@/features/auth/store";
import type { Order, PlaceOrderBody } from "@/shared/types";
import { cartKeys } from "@/features/cart/queries";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: string) => ["orders", id] as const,
};

export function useOrders() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: () => ApiService.get<Order[]>("/api/orders", { auth: true }),
    enabled: !!user,
  });
}

export function useOrder(id: string) {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ApiService.get<Order>(`/api/orders/${id}`, { auth: true }),
    enabled: !!user && !!id,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PlaceOrderBody) =>
      ApiService.post<Order>("/api/orders", { auth: true, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      ApiService.post(`/api/orders/${id}/cancel`, { auth: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
