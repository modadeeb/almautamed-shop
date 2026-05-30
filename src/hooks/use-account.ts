"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { storeApi } from "@/lib/store-api";

/** يجلب الحساب الحالي (mock حالياً). يُرجع null إذا لم يكن مسجّلاً. */
export function useAccount() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: () => storeApi.auth.me(),
  });
}
