<?php

return [

    /*
    |--------------------------------------------------------------------------
    | إعدادات Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    |
    | تسمح لواجهة React/Vite (المنفصلة) بالاتصال بالـ API مع دعم اعتماد
    | الكوكيز الخاصة بـ Sanctum (SPA authentication).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

    // أصول الواجهة المسموح بها — تُضبط عبر .env ولا تُترك '*' مع الاعتماد.
    'allowed_origins' => explode(',', env('FRONTEND_URL', 'http://localhost:5173')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // مطلوب true لكي تعمل مصادقة Sanctum القائمة على الكوكيز.
    'supports_credentials' => true,

];
