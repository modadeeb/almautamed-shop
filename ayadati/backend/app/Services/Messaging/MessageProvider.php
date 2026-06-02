<?php

namespace App\Services\Messaging;

/**
 * عقد مزوّد الرسائل القابل للتبديل (واتساب / SMS / غيرها).
 *
 * أي مزوّد جديد يكفي أن يطبّق هذه الواجهة ويُسجَّل في الحاوية لكي يصبح
 * قابلاً للاستخدام دون تغيير منطق التذكيرات.
 */
interface MessageProvider
{
    /** معرّف القناة، مثل "whatsapp" أو "sms". */
    public function channel(): string;

    /** هل المزوّد مهيّأ بالكامل (مفاتيح/إعدادات موجودة)؟ */
    public function isConfigured(): bool;

    /**
     * إرسال رسالة نصية إلى رقم وجهة (بصيغة دولية E.164).
     *
     * @param  string  $to  رقم المستلم
     * @param  string  $message  نص الرسالة (عربي)
     */
    public function send(string $to, string $message): MessageResult;
}
