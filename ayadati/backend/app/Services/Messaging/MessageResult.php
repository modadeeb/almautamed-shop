<?php

namespace App\Services\Messaging;

/**
 * نتيجة محاولة إرسال رسالة عبر أحد المزوّدات.
 */
final readonly class MessageResult
{
    public function __construct(
        public bool $success,
        public string $channel,
        public ?string $providerMessageId = null,
        public ?string $error = null,
    ) {
    }

    public static function ok(string $channel, ?string $providerMessageId = null): self
    {
        return new self(true, $channel, $providerMessageId, null);
    }

    public static function failed(string $channel, string $error): self
    {
        return new self(false, $channel, null, $error);
    }
}
