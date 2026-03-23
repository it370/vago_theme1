import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import type { Offer, Product } from "@/shared/types";
import { normalizeProducts } from "@/features/products/normalize";

export const offerKeys = {
  all: ["offers"] as const,
  detail: (id: string) => ["offers", id] as const,
  products: (id: string) => ["offers", id, "products"] as const,
};

export function useOffers() {
  return useQuery({
    queryKey: offerKeys.all,
    queryFn: () => ApiService.get<Offer[]>("/api/offers"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOfferProducts(offerId: string) {
  return useQuery({
    queryKey: offerKeys.products(offerId),
    queryFn: async () =>
      normalizeProducts(
        await ApiService.get<Product[]>(`/api/offers/${offerId}/products`)
      ),
    enabled: !!offerId,
    staleTime: 3 * 60 * 1000,
  });
}
