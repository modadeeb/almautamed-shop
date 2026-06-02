<?php

namespace App\Services\Messaging\Providers;

use App\Services\Messaging\MessageProvider;
use App\Services\Messaging\MessageResult;
use RuntimeException;

/**
 * مزوّد رسائل واتساب (القناة الأساسية).
 *
 * M0: هيكل فقط — التوصيل الفعلي بواجهة واتساب يُنفَّذ في M7. يُعتبر غير
 * مهيّأ ما لم تُضبط مفاتيح الـ API في .env، وعندها يفشل بوضوح بدل الادّعاء
 * بالنجاح.
 */
class WhatsAppProvider implements MessageProvider
{
    /**
     * @param  array<string, mixed>  $config
     */
    public function __construct(private readonly array $config = [])
    {
    }

    public function channel(): string
    {
        return 'whatsapp';
    }

    public function isConfigured(): bool
    {
        return ! empty($this->config['api_url']) && ! empty($this->config['token']);
    }

    public function send(string $to, string $message): MessageResult
    {
        if (! $this->isConfigured()) {
            return MessageResult::failed(
                $this->channel(),
                'مزوّد واتساب غير مهيّأ بعد (يُوصَّل في المرحلة M7).'
            );
        }

        // التنفيذ الفعلي (استدعاء HTTP لواجهة واتساب) يُضاف في M7.
        throw new RuntimeException('WhatsApp sending is implemented in milestone M7.');
    }
}
