<?php

namespace Tests\Unit;

use App\Services\Messaging\Exceptions\MessagingException;
use App\Services\Messaging\MessageProvider;
use App\Services\Messaging\MessageResult;
use App\Services\Messaging\MessagingManager;
use Tests\TestCase;

class MessagingManagerTest extends TestCase
{
    private function fakeProvider(string $channel, bool $succeeds, bool $configured = true): MessageProvider
    {
        return new class($channel, $succeeds, $configured) implements MessageProvider
        {
            public function __construct(
                private string $channel,
                private bool $succeeds,
                private bool $configured,
            ) {
            }

            public function channel(): string
            {
                return $this->channel;
            }

            public function isConfigured(): bool
            {
                return $this->configured;
            }

            public function send(string $to, string $message): MessageResult
            {
                return $this->succeeds
                    ? MessageResult::ok($this->channel, 'id-123')
                    : MessageResult::failed($this->channel, 'تعذّر الإرسال');
            }
        };
    }

    public function test_uses_primary_channel_when_it_succeeds(): void
    {
        $manager = new MessagingManager(
            providers: [
                'whatsapp' => $this->fakeProvider('whatsapp', true),
                'sms' => $this->fakeProvider('sms', true),
            ],
            default: 'whatsapp',
            fallback: 'sms',
        );

        $result = $manager->send('+967700000000', 'مرحباً');

        $this->assertTrue($result->success);
        $this->assertSame('whatsapp', $result->channel);
    }

    public function test_falls_back_to_secondary_when_primary_fails(): void
    {
        $manager = new MessagingManager(
            providers: [
                'whatsapp' => $this->fakeProvider('whatsapp', false),
                'sms' => $this->fakeProvider('sms', true),
            ],
            default: 'whatsapp',
            fallback: 'sms',
        );

        $result = $manager->send('+967700000000', 'مرحباً');

        $this->assertTrue($result->success);
        $this->assertSame('sms', $result->channel);
    }

    public function test_throws_when_all_channels_fail(): void
    {
        $manager = new MessagingManager(
            providers: [
                'whatsapp' => $this->fakeProvider('whatsapp', false),
                'sms' => $this->fakeProvider('sms', false),
            ],
            default: 'whatsapp',
            fallback: 'sms',
        );

        $this->expectException(MessagingException::class);
        $manager->send('+967700000000', 'مرحباً');
    }

    public function test_available_channel_reflects_configuration(): void
    {
        $manager = new MessagingManager(
            providers: [
                'whatsapp' => $this->fakeProvider('whatsapp', true, configured: false),
                'sms' => $this->fakeProvider('sms', true, configured: true),
            ],
            default: 'whatsapp',
            fallback: 'sms',
        );

        $this->assertSame('sms', $manager->availableChannel());
    }
}
