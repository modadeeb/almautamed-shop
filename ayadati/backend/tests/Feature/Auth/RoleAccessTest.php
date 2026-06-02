<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    private function tokenFor(User $user): string
    {
        return $user->createToken('test')->plainTextToken;
    }

    public function test_admin_can_access_admin_route(): void
    {
        $admin = User::factory()->admin()->create();

        $this->withHeader('Authorization', 'Bearer '.$this->tokenFor($admin))
            ->getJson('/api/admin/ping')
            ->assertOk()
            ->assertJson(['scope' => 'admin']);
    }

    public function test_patient_cannot_access_admin_route(): void
    {
        $patient = User::factory()->patient()->create();

        $this->withHeader('Authorization', 'Bearer '.$this->tokenFor($patient))
            ->getJson('/api/admin/ping')
            ->assertForbidden()
            ->assertJson(['message' => 'ليس لديك صلاحية للقيام بهذا الإجراء.']);
    }

    public function test_doctor_can_access_doctor_route_only(): void
    {
        $doctor = User::factory()->doctor()->create();
        $token = $this->tokenFor($doctor);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/doctor/ping')->assertOk();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/patient/ping')->assertForbidden();
    }

    public function test_guest_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/admin/ping')->assertUnauthorized();
    }
}
