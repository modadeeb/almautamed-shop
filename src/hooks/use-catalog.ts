"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { storeApi } from "@/lib/store-api";
import type { AccountType, ProductFilters } from "@/lib/store-api/types";

/** بانرات حسب الجمهور (الافتراضي: الكل). */
export function useBanners(audience?: AccountType) {
  return useQuery({
    queryKey: queryKeys.banners(audience),
    queryFn: () => storeApi.catalog.getBanners(audience),
  });
}

/** شجرة الفئات. */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => storeApi.catalog.getCategories(),
  });
}

/** قائمة المنتجات المُقسّمة على صفحات وفق المرشّحات. */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => storeApi.catalog.getProducts(filters),
    placeholderData: (prev) => prev,
  });
}

/** منتج واحد عبر الـ slug. */
export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => storeApi.catalog.getProduct(slug),
    enabled: Boolean(slug),
  });
}

/** بحث نصّي عن المنتجات. */
export function useSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => storeApi.catalog.search(query),
    enabled: query.trim().length > 0,
  });
}
