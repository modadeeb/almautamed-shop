import type { ProductFilters } from "@/lib/store-api/types";

/** مفاتيح react-query مركزية لتجنّب التضارب وتسهيل الإبطال (invalidation). */
export const queryKeys = {
  banners: (audience?: string) => ["banners", audience ?? "all"] as const,
  categories: () => ["categories"] as const,
  products: (filters?: ProductFilters) => ["products", filters ?? {}] as const,
  product: (slug: string) => ["product", slug] as const,
  search: (query: string) => ["search", query] as const,
  cart: () => ["cart"] as const,
  me: () => ["me"] as const,
  profile: () => ["profile"] as const,
  addresses: () => ["addresses"] as const,
  orders: () => ["orders"] as const,
  order: (id: string) => ["order", id] as const,
  upgradeRequest: () => ["wholesale", "upgrade-request"] as const,
  creditStatus: () => ["wholesale", "credit-status"] as const,
  storeBanks: () => ["wholesale", "store-banks"] as const,
} as const;
