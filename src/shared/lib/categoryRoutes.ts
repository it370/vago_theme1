import type { Category } from "@/shared/types";

/** Path segment for `/category/[segment]` — prefer slug when present for stable URLs. */
export function categoryListingHref(cat: Pick<Category, "id" | "slug">): string {
  const segment = (cat.slug?.trim() || cat.id).trim();
  return `/category/${encodeURIComponent(segment)}`;
}

/** Resolve URL segment (id or slug) to the category id used by the products API. */
export function resolveCategoryIdForApi(
  segment: string,
  categories: Category[] | undefined
): string {
  const decoded = decodeURIComponent(segment);
  const match = categories?.find((c) => c.id === decoded || c.slug === decoded);
  return match?.id ?? decoded;
}
