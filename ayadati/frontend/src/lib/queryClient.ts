import { QueryClient } from '@tanstack/react-query'

/**
 * إعداد TanStack Query محسّن لشبكات 3G الضعيفة:
 * - تخزين مؤقت مع stale-while-revalidate (staleTime).
 * - إعادة المحاولة مع تأخير تصاعدي (exponential backoff) عند فشل الشبكة.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // دقيقة: تُعرض البيانات المخزّنة فوراً ثم تُحدَّث بالخلفية.
      gcTime: 5 * 60_000,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 16_000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
