<?php

namespace Tests\Feature;

use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorProfileTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsDoctor(): User
    {
        $doctor = User::factory()->doctor()->create();
        $this->withHeader('Authorization', 'Bearer '.$doctor->createToken('t')->plainTextToken);

        return $doctor;
    }

    public function test_doctor_can_update_own_profile_and_gets_published(): void
    {
        $this->actingAsDoctor();
        $specialty = Specialty::factory()->create();

        $response = $this->putJson('/api/doctor/profile', [
            'specialty_id' => $specialty->id,
            'clinic_name' => 'عيادة النور',
            'city' => 'صنعاء',
            'bio' => 'طبيب باطنية',
            'years_experience' => 10,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.clinic_name', 'عيادة النور')
            ->assertJsonPath('data.specialty.id', $specialty->id);

        $this->assertDatabaseHas('doctors', [
            'clinic_name' => 'عيادة النور',
            'is_published' => true,
        ]);
    }

    public function test_profile_update_requires_specialty_and_clinic(): void
    {
        $this->actingAsDoctor();

        $this->putJson('/api/doctor/profile', ['city' => 'عدن'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['specialty_id', 'clinic_name']);
    }

    public function test_patient_cannot_access_doctor_profile_endpoint(): void
    {
        $patient = User::factory()->patient()->create();
        $this->withHeader('Authorization', 'Bearer '.$patient->createToken('t')->plainTextToken);

        $this->getJson('/api/doctor/profile')->assertForbidden();
    }

    public function test_guest_cannot_update_doctor_profile(): void
    {
        $this->putJson('/api/doctor/profile', [])->assertUnauthorized();
    }
}
