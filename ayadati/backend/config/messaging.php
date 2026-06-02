<?php

return [

    /*
    |--------------------------------------------------------------------------
    | إعدادات مزوّد الرسائل (تذكيرات الحجوزات)
    |--------------------------------------------------------------------------
    |
    | واجهة مزوّد قابلة للتبديل. القناة الأساسية هي واتساب، والاحتياطية SMS.
    | في M0 نُعرّف الواجهة والمزوّدات كهياكل (stubs) فقط؛ التوصيل الفعلي
    | لمزوّد حقيقي يُؤجَّل إلى المرحلة M7.
    |
    */

    // القناة الأساسية: whatsapp، والاحتياطية عند الفشل: sms.
    'default' => env('MESSAGING_CHANNEL', 'whatsapp'),

    'fallback' => env('MESSAGING_FALLBACK_CHANNEL', 'sms'),

    'channels' => [

        'whatsapp' => [
            'driver' => 'whatsapp',
            // تُملأ فعلياً في M7. لا تضع أسراراً هنا — كلها من .env.
            'api_url' => env('WHATSAPP_API_URL'),
            'token' => env('WHATSAPP_API_TOKEN'),
            'from' => env('WHATSAPP_FROM'),
        ],

        'sms' => [
            'driver' => 'sms',
            'api_url' => env('SMS_API_URL'),
            'token' => env('SMS_API_TOKEN'),
            'sender' => env('SMS_SENDER'),
        ],

    ],

];
