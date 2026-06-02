<?php

namespace App\Services\Messaging;

use App\Services\Messaging\Exceptions\MessagingException;
use Illuminate\Support\Facades\Log;

/**
 * منسّق إرسال الرسائل: يجرّب القناة الأساسية (واتساب) ثم يسقط تلقائياً
 * إلى القناة الاحتياطية (SMS) عند الفشل أو عدم التهيئة.
 *
 * المزوّدات قابلة للتبديل بالكامل عبر العقد MessageProvider؛ لا يعرف هذا
 * المنسّق أي تفاصيل عن واتساب أو SMS تحديداً.
 */
class MessagingManager
{
    /**
     * @param  array<string, MessageProvider>  $providers  مفهرسة باسم القناة
     */
    public function __construct(
        private readonly array $providers,
        private readonly string $default,
        private readonly string $fallback,
    ) {
    }

    /**
     * إرسال رسالة، مع السقوط للقناة الاحتياطية عند الحاجة.
     *
     * @throws MessagingException عند فشل كل القنوات.
     */
    public function send(string $to, string $message): MessageResult
    {
        $order = array_values(array_unique(array_filter([$this->default, $this->fallback])));
        $errors = [];

        foreach ($order as $channel) {
            $provider = $this->providers[$channel] ?? null;
            if ($provider === null) {
                $errors[$channel] = 'قناة غير معرّفة';

                continue;
            }

            $result = $provider->send($to, $message);
            if ($result->success) {
                return $result;
            }

            $errors[$channel] = $result->error ?? 'فشل غير معروف';
            Log::warning('فشل إرسال رسالة عبر قناة، محاولة القناة التالية', [
                'channel' => $channel,
                'error' => $errors[$channel],
            ]);
        }

        throw new MessagingException(
            'تعذّر إرسال الرسالة عبر كل القنوات: '.json_encode($errors, JSON_UNESCAPED_UNICODE)
        );
    }

    /** القناة المتاحة المهيّأة فعلياً، أو null إن لم تتوفّر أي قناة. */
    public function availableChannel(): ?string
    {
        foreach ([$this->default, $this->fallback] as $channel) {
            $provider = $this->providers[$channel] ?? null;
            if ($provider !== null && $provider->isConfigured()) {
                return $channel;
            }
        }

        return null;
    }
}
