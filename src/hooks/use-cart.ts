"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { storeApi } from "@/lib/store-api";
import type { Cart } from "@/lib/store-api/types";

/** يجلب السلة الحالية من الـ API (mock حالياً). */
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart(),
    queryFn: () => storeApi.cart.getCart(),
  });
}

/** عدد القطع الكليّ في السلة (مجموع الكميات). */
export function useCartCount() {
  const { data } = useCart();
  return data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

/** mutations للسلة مع تحديث الكاش وإظهار toasts. */
export function useCartMutations() {
  const qc = useQueryClient();

  const onSuccess = (cart: Cart) => {
    qc.setQueryData(queryKeys.cart(), cart);
  };

  const addItem = useMutation({
    mutationFn: storeApi.cart.addItem,
    onSuccess: (cart) => {
      onSuccess(cart);
      toast.success("تمت الإضافة إلى السلة");
    },
  });

  const updateItem = useMutation({
    mutationFn: storeApi.cart.updateItem,
    onSuccess,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => storeApi.cart.removeItem(itemId),
    onSuccess: (cart) => {
      onSuccess(cart);
      toast("تمت إزالة العنصر");
    },
  });

  const applyCoupon = useMutation({
    mutationFn: (code: string) => storeApi.cart.applyCoupon(code),
    onSuccess: (cart) => {
      onSuccess(cart);
      if (cart.discount.amount > 0) {
        toast.success("تم تطبيق الكوبون");
      } else {
        toast.error("كوبون غير صالح");
      }
    },
  });

  return { addItem, updateItem, removeItem, applyCoupon };
}
