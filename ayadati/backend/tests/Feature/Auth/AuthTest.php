<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_patient_by_default(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'أحمد محمد',
            'email' => 'ahmed@example.com',
            'phone' => '770123456',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role'], 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'ahmed@example.com',
            'role' => 'patient',
        ]);
    }

    public function test_user_can_register_as_doctor(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'د. سارة',
            'email' => 'sara@example.com',
            'phone' => '771222333',
            'role' => 'doctor',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('users', ['email' => 'sara@example.com', 'role' => 'doctor']);
    }

    public function test_user_cannot_self_register_as_admin(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'مخترق',
            'email' => 'hack@example.com',
            'phone' => '772333444',
            'role' => 'admin',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('role');
    }

    public function test_registration_requires_valid_phone(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'اسم',
            'email' => 'x@example.com',
            'phone' => 'abc',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('phone');
    }

    public function test_validation_errors_are_in_arabic(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422);
        $this->assertSame('البيانات المُدخلة غير صحيحة.', $response->json('message'));
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create(['email' => 'login@example.com']);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['email' => 'login2@example.com']);

        $response = $this->postJson('/api/login', [
            'email' => 'login2@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'inactive@example.com',
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'inactive@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_authenticated_user_can_fetch_profile_and_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('user.email', $user->email);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout')
            ->assertOk();

        // الرمز أُبطل بعد الخروج.
        $this->assertCount(0, $user->fresh()->tokens);
    }
}
