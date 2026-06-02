import axios, { AxiosError, type AxiosInstance } from 'axios'
import { authStorage } from '@/features/auth/authStorage'

// عنوان الـ API يأتي من متغيّر البيئة، مع قيمة افتراضية للتطوير المحلي.
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/**
 * عميل HTTP موحّد للاتصال بـ Laravel API.
 * withCredentials يدعم مصادقة Sanctum القائمة على الكوكيز عند الحاجة،
 * كما نُرفق رمز Bearer من التخزين المحلي للمصادقة القائمة على الرموز.
 */
export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use((config) => {
  const token = authStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** شكل خطأ التحقّق العائد من Laravel (422). */
export interface ApiValidationError {
  message: string
  errors: Record<string, string[]>
}

/** استخراج رسالة عربية واضحة من خطأ API. */
export function extractApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<ApiValidationError> | undefined
    if (data?.errors) {
      const first = Object.values(data.errors)[0]
      if (first?.[0]) return first[0]
    }
    if (data?.message) return data.message
    if (!error.response) return 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت.'
  }
  return 'حدث خطأ غير متوقّع. يُرجى المحاولة لاحقاً.'
}
