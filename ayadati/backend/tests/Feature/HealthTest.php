<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthTest extends TestCase
{
    public function test_health_endpoint_returns_ok(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertOk()
            ->assertJson([
                'status' => 'ok',
                'database' => 'ok',
            ])
            ->assertJsonStructure(['status', 'app', 'time', 'database']);
    }

    public function test_security_headers_are_present(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_unauthenticated_user_endpoint_returns_arabic_401(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized()
            ->assertJson(['message' => 'يجب تسجيل الدخول للوصول إلى هذا المورد.']);
    }
}
