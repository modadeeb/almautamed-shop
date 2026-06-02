<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_specialties_endpoint_returns_active_specialties(): void
    {
        Specialty::factory()->count(3)->create();
        Specialty::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/specialties');

        $response->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_doctors_list_is_paginated_and_only_published(): void
    {
        Doctor::factory()->count(15)->create();
        Doctor::factory()->unpublished()->count(3)->create();

        $response = $this->getJson('/api/doctors');

        $response->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonCount(12, 'data'); // أول صفحة (12 لكل صفحة)

        $this->assertSame(15, $response->json('meta.total'));
    }

    public function test_doctors_can_be_filtered_by_specialty_slug(): void
    {
        $cardio = Specialty::factory()->create(['slug' => 'cardiology']);
        $derma = Specialty::factory()->create(['slug' => 'dermatology']);

        Doctor::factory()->count(2)->create(['specialty_id' => $cardio->id]);
        Doctor::factory()->count(5)->create(['specialty_id' => $derma->id]);

        $response = $this->getJson('/api/doctors?specialty=cardiology');

        $response->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_doctors_can_be_searched_by_name(): void
    {
        $user = User::factory()->doctor()->create(['name' => 'محمد العزّي']);
        Doctor::factory()->create(['user_id' => $user->id]);
        Doctor::factory()->count(4)->create();

        $response = $this->getJson('/api/doctors?q=العزّي');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_doctor_profile_can_be_viewed_when_published(): void
    {
        $doctor = Doctor::factory()->create();

        $this->getJson("/api/doctors/{$doctor->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $doctor->id);
    }

    public function test_unpublished_doctor_returns_404(): void
    {
        $doctor = Doctor::factory()->unpublished()->create();

        $this->getJson("/api/doctors/{$doctor->id}")->assertNotFound();
    }
}
