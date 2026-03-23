import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiService } from "@/shared/services/api";
import type { Product } from "@/shared/types";
import { normalizeProduct, normalizeProducts } from "@/features/products/normalize";

export const productKeys = {
  all: ["products"] as const,
  list: (params: Record<string, string>) => ["products", "list", params] as const,
  detail: (id: string) => ["products", id] as const,
  suggestions: (q: string) => ["products", "suggestions", q] as const,
};

export function useProducts(
  params: { categoryId?: string; sortBy?: string; search?: string; enabled?: boolean } = {}
) {
  const { enabled = true, ...queryParams } = params;
  const sp = new URLSearchParams();
  if (queryParams.categoryId) sp.set("categoryId", queryParams.categoryId);
  if (queryParams.sortBy) sp.set("sortBy", queryParams.sortBy);
  if (queryParams.search) sp.set("search", queryParams.search);
  const qs = sp.toString();

  return useQuery({
    queryKey: productKeys.list(queryParams as Record<string, string>),
    queryFn: async () =>
      normalizeProducts(
        await ApiService.get<Product[]>(`/api/products${qs ? `?${qs}` : ""}`)
      ),
    enabled,
    staleTime: 3 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () =>
      normalizeProduct(await ApiService.get<Product>(`/api/products/${id}`)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductSuggestions(rawQuery: string) {
  const [debounced, setDebounced] = useState(rawQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(rawQuery), 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const q = debounced.trim();

  return useQuery({
    queryKey: productKeys.suggestions(q),
    queryFn: async () =>
      normalizeProducts(
        await ApiService.get<Product[]>(
          `/api/products?search=${encodeURIComponent(q)}&limit=6`
        )
      ),
    enabled: q.length >= 2,
    staleTime: 30 * 1000,
  });
}
