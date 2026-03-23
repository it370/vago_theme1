import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import { useAuthStore } from "@/features/auth/store";

export interface ProductNote {
  productId: string;
  productName: string;
  note: string;
}

export interface CategoryNote {
  categoryId: string;
  categoryName: string;
  note: string;
}

export interface CheckoutNotes {
  global: string;
  products: ProductNote[];
  categories: CategoryNote[];
}

export const checkoutKeys = {
  notes: (productIds: string[]) =>
    ["checkout", "seller-notes", productIds.slice().sort()] as const,
};

export function useCheckoutNotes(productIds: string[]) {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: checkoutKeys.notes(productIds),
    queryFn: () =>
      ApiService.get<CheckoutNotes>(
        `/api/checkout/seller-notes?productIds=${productIds.join(",")}`,
        { auth: true }
      ),
    enabled: !!user && productIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
