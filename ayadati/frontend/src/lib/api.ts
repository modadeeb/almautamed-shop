import axios, { type AxiosInstance } from 'axios'

// عنوان الـ API يأتي من متغيّر البيئة، مع قيمة افتراضية للتطوير المحلي.
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/**
 * عميل HTTP موحّد للاتصال بـ Laravel API.
 * withCredentials مطلوب لمصادقة Sanctum القائمة على الكوكيز (SPA).
 */
export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/** جلب كوكي CSRF من Sanctum قبل الطلبات التي تغيّر الحالة. */
export async function ensureCsrf(): Promise<void> {
  await api.get('/sanctum/csrf-cookie')
}
