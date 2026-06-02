# عيادتي — منصّة حجز العيادات الذكية

منصّة SaaS عربية بالكامل (RTL) لحجز مواعيد العيادات في اليمن، مع تذكيرات
تلقائية (واتساب/SMS)، تأكيد فوري، وإعادة جدولة أونلاين. مصمّمة لتكون **خفيفة
وسريعة على شبكات 3G الضعيفة**.

> هذا المشروع مستقلّ تماماً عن متجر الأدوية (Next.js) الموجود في جذر المستودع،
> ويعيش بالكامل داخل مجلد `ayadati/`.

## التقنيات

| الطبقة | التقنية |
|---|---|
| الخلفية (API) | Laravel 13 (PHP 8.4) + Sanctum + Queues + Scheduler |
| الواجهة | React 19 + TypeScript (strict) + Vite + Tailwind CSS (RTL) |
| قاعدة البيانات | **MySQL** (إنتاج) — SQLite للاختبارات المحلية فقط |
| جلب البيانات | TanStack Query (cache + retry/backoff) |
| PWA | vite-plugin-pwa (service worker + صفحة offline + تثبيت) |

## البنية

```
ayadati/
├─ backend/    Laravel API
└─ frontend/   React + Vite SPA
```

## التشغيل

### الخلفية
```bash
cd backend
composer install
cp .env.example .env        # اضبط اتصال MySQL
php artisan key:generate
php artisan migrate
php artisan serve            # http://localhost:8000
```

### الواجهة
```bash
cd frontend
npm install
cp .env.example .env         # VITE_API_URL=http://localhost:8000
npm run dev                  # http://localhost:5173
```

## أوامر الجودة

| | الأمر |
|---|---|
| اختبارات الخلفية | `cd backend && php artisan test` |
| بناء الواجهة | `cd frontend && npm run build` |
| فحص الأنواع | `cd frontend && npm run type-check` |
| الـ lint | `cd frontend && npm run lint` |

## ⚠️ ملاحظة قاعدة البيانات (MySQL)

الكود والـ migrations والفهارس مكتوبة لـ **MySQL**. البيئة التطويرية الحالية
لا تحوي خادم MySQL، لذا تعمل الاختبارات الآلية على **SQLite in-memory**.
**يجب التحقّق من تشغيل الـ migrations والاختبارات على MySQL حقيقي قبل اعتماد
أي مرحلة وقبل الإنتاج** (انتبه لاختلافات أنواع الأعمدة، JSON، والمفاتيح
الأجنبية بين SQLite و MySQL).

## التذكيرات

القناة الأساسية **واتساب** والاحتياطية **SMS**. في M0 تتوفّر *واجهة المزوّد
القابلة للتبديل* (`App\Services\Messaging`) فقط؛ التوصيل الفعلي بمزوّد حقيقي
يُنفَّذ في المرحلة M7.
