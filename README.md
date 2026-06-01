# متجر المعتمد للأدوية (Almautamed Shop)

متجر إلكتروني (تجزئة + جملة) لشركة أدوية في اليمن، مبني بـ **Next.js (App Router) + TypeScript**.
سيتصل لاحقاً بنظام ERP محاسبي (Laravel + PostgreSQL + Sanctum) عبر REST API على
`http://localhost:8000/api/store`.

> **المرحلة الحالية: 1 (الأساس).** البنية والتصميم وعقد الـ API فقط. كل البيانات
> وهمية (mock) — لا اتصال بأي API حقيقي بعد، ولا منطق كتالوج أو دفع.

## التقنيات

- Next.js + App Router + TypeScript
- Tailwind CSS + shadcn/ui (design tokens + Dark mode)
- خطوط عربية: IBM Plex Sans Arabic (أساسي) و Tajawal (بديل) عبر `next/font/google`
- @tanstack/react-query لإدارة حالة الخادم
- zod + react-hook-form (مهيّأة للنماذج لاحقاً)
- واجهة كاملة عربية RTL (`<html lang="ar" dir="rtl">`)

## التشغيل

```bash
npm install
cp .env.example .env.local   # عدّل القيم عند الحاجة
npm run dev
```

ثم افتح http://localhost:3000

## متغيّرات البيئة

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/store   # لا يُستخدم في المرحلة 1
NEXT_PUBLIC_DEFAULT_CURRENCY=YER                           # تُقرأ عبر formatMoney
```

> لا يُكتب أي رمز عملة ثابتاً في الكود. كل تنسيق مبلغ يمرّ عبر
> `formatMoney(amount, currencyCode)` في `src/lib/format.ts`.

## البنية

```
src/
├─ app/                      # المسارات (App Router) — placeholders عدا Layout
│  ├─ layout.tsx             # Layout مكتمل: Header + Footer + Providers + الخطوط
│  ├─ page.tsx               # الصفحة الرئيسية
│  └─ ...                    # category, product, search, cart, checkout, account, ...
├─ components/
│  ├─ ui/                    # مكوّنات shadcn/ui
│  ├─ layout/                # Header, Footer, CartSheet, MobileNav, ...
│  └─ providers.tsx          # react-query + ThemeProvider + Toaster
├─ hooks/                    # useCart, useAccount
└─ lib/
   ├─ format.ts              # formatMoney + formatDate (عربي)
   ├─ site.ts                # ثوابت الهوية والروابط
   └─ store-api/             # عقد الـ API (Contract-first)
      ├─ types.ts            # كل الأنواع
      ├─ store-api.ts        # واجهة StoreApi
      ├─ index.ts            # export const storeApi (= mock حالياً)
      └─ mock/               # mockStoreApi + بيانات وهمية
```

## عقد الـ API

كل الصفحات تستهلك `storeApi` من `@/lib/store-api` فقط. في المرحلة 1 يُنفَّذ عبر
`mockStoreApi`. لاحقاً يُستبدَل بـ `httpStoreApi` (يتصل بـ Laravel/Sanctum) بنفس
واجهة `StoreApi` تماماً — دون تغيير أي صفحة.
