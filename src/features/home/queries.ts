import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/shared/services/api";
import type { FeedResponse, NewArrivalsResponse } from "@/shared/types";
import { normalizeFeedResponse, normalizeProducts } from "@/features/products/normalize";

export function useFeed() {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () =>
      normalizeFeedResponse(await ApiService.get<FeedResponse>("/api/feed")),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const res = await ApiService.get<NewArrivalsResponse>("/api/new-arrivals");
      return {
        label: res.label ?? "New Arrivals",
        products: normalizeProducts(res.products ?? []),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
