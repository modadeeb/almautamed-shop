/**
 * نقطة الدخول الموحّدة لـ Store API.
 *
 * المرحلة 1: نُصدّر التنفيذ الوهمي (mock).
 * لاحقاً: يُستبدَل السطر أدناه بـ httpStoreApi (يتصل بـ Laravel/Sanctum على
 * ‎`NEXT_PUBLIC_API_BASE_URL`) بنفس واجهة StoreApi تماماً ودون تغيير أي صفحة.
 *
 *   // import { httpStoreApi } from "./http/httpStoreApi";
 *   // export const storeApi: StoreApi = httpStoreApi;
 */
import type { StoreApi } from "./store-api";
import { mockStoreApi } from "./mock/mockStoreApi";

export const storeApi: StoreApi = mockStoreApi;

export type { StoreApi } from "./store-api";
export * from "./types";
