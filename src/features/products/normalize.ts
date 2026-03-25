import type { Product, CartResponse, FeedResponse, WishlistResponse } from "@/shared/types";

export function normalizeProduct(p: Product): Product {
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
    sizes: Array.isArray(p.sizes) ? p.sizes.filter(Boolean) : [],
    colors: Array.isArray(p.colors) ? p.colors.filter(Boolean) : [],
    packOptions: Array.isArray(p.packOptions)
      ? p.packOptions.filter((o) => o && o.label && typeof o.price === "number")
      : undefined,
  };
}

export function normalizeProducts(products: Product[]): Product[] {
  return (products ?? []).map(normalizeProduct);
}

export function normalizeFeedResponse(feed: FeedResponse): FeedResponse {
  return {
    ...feed,
    products: normalizeProducts(feed.products ?? []),
    categories: feed.categories ?? [],
    offers: feed.offers ?? [],
  };
}

export function normalizeCartResponse(cart: CartResponse): CartResponse {
  return {
    ...cart,
    items: (cart.items ?? []).map((item) => ({
      ...item,
      product: item.product ? normalizeProduct(item.product) : undefined,
    })),
    summary: cart.summary ?? {
      itemCount: 0,
      subtotalOriginal: 0,
      totalDiscount: 0,
      subtotalPayable: 0,
    },
  };
}

export function normalizeWishlistResponse(w: WishlistResponse): WishlistResponse {
  return {
    ...w,
    productIds: w.productIds ?? [],
    products: normalizeProducts(w.products ?? []),
  };
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
