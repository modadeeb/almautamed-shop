<?php

namespace App\Services\Messaging\Providers;

use App\Services\Messaging\MessageProvider;
use App\Services\Messaging\MessageResult;
use RuntimeException;

/**
 * مزوّد رسائل SMS (القناة الاحتياطية عند تعذّر واتساب).
 *
 * M0: هيكل فقط — التوصيل الفعلي يُنفَّذ في M7.
 */
class SmsProvider implements MessageProvider
{
    /**
     * @param  array<string, mixed>  $config
     */
    public function __construct(private readonly array $config = [])
    {
    }

    public function channel(): string
    {
        return 'sms';
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
                'مزوّد SMS غير مهيّأ بعد (يُوصَّل في المرحلة M7).'
            );
        }

        // التنفيذ الفعلي يُضاف في M7.
        throw new RuntimeException('SMS sending is implemented in milestone M7.');
    }
}
