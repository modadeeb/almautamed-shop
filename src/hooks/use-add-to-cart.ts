"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { storeApi } from "@/lib/store-api";
import type { Cart, Product } from "@/lib/store-api/types";

/**
 * إضافة منتج إلى السلة: يستدعي storeApi.cart.addItem، ثم يُحدّث كاش react-query
 * للسلة (لتنعكس في الهيدر والـ Sheet)، ويُظهر toast نجاح.
 */
export function useAddToCart() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      storeApi.cart.addItem({ productId, quantity }),
    onSuccess: (cart: Cart) => {
      qc.setQueryData(queryKeys.cart(), cart);
    },
  });

  /** يضيف منتجاً للسلة مع رسالة نجاح تحمل اسم المنتج. */
  function addToCart(product: Product, quantity = 1) {
    if (!product.inStock) return;
    mutation.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          toast.success("تمت الإضافة إلى السلة", {
            description: product.name,
          });
        },
        onError: () => {
          toast.error("تعذّرت إضافة المنتج، حاول مجدداً");
        },
      },
    );
  }

  return {
    addToCart,
    isPending: mutation.isPending,
    pendingProductId: mutation.variables?.productId,
  };
}
