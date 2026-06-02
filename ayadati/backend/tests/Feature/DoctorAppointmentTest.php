<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorAppointmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-06-07 07:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function actingAsDoctor(): Doctor
    {
        $doctor = Doctor::factory()->create(['consultation_fee' => 3000]);
        $this->withHeader('Authorization', 'Bearer '.$doctor->user->createToken('t')->plainTextToken);

        return $doctor;
    }

    public function test_doctor_lists_only_their_appointments(): void
    {
        $doctor = $this->actingAsDoctor();
        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'starts_at' => Carbon::parse('2026-06-10 09:00'),
            'ends_at' => Carbon::parse('2026-06-10 09:30'),
        ]);
        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'starts_at' => Carbon::parse('2026-06-10 10:00'),
            'ends_at' => Carbon::parse('2026-06-10 10:30'),
        ]);
        Appointment::factory()->create(); // طبيب آخر

        $this->getJson('/api/doctor/appointments')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_doctor_can_update_appointment_status(): void
    {
        $doctor = $this->actingAsDoctor();
        $appointment = Appointment::factory()->create(['doctor_id' => $doctor->id]);

        $this->patchJson("/api/doctor/appointments/{$appointment->id}/status", [
            'status' => 'completed',
        ])->assertOk()->assertJsonPath('data.status', 'completed');
    }

    public function test_doctor_cannot_set_status_back_to_pending(): void
    {
        $doctor = $this->actingAsDoctor();
        $appointment = Appointment::factory()->create(['doctor_id' => $doctor->id]);

        $this->patchJson("/api/doctor/appointments/{$appointment->id}/status", [
            'status' => 'pending',
        ])->assertStatus(422);
    }

    public function test_approving_payment_confirms_appointment(): void
    {
        $doctor = $this->actingAsDoctor();
        $appointment = Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'status' => 'pending',
        ]);
        Payment::factory()->create(['appointment_id' => $appointment->id, 'status' => 'pending']);

        $this->postJson("/api/doctor/appointments/{$appointment->id}/payment/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed')
            ->assertJsonPath('data.payment.status', 'approved');

        $this->assertDatabaseHas('appointments', ['id' => $appointment->id, 'status' => 'confirmed']);
    }

    public function test_rejecting_payment_cancels_appointment(): void
    {
        $doctor = $this->actingAsDoctor();
        $appointment = Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'status' => 'pending',
        ]);
        Payment::factory()->create(['appointment_id' => $appointment->id, 'status' => 'pending']);

        $this->postJson("/api/doctor/appointments/{$appointment->id}/payment/reject", [
            'reason' => 'الإيصال غير واضح',
        ])->assertOk()
            ->assertJsonPath('data.status', 'cancelled')
            ->assertJsonPath('data.payment.status', 'rejected');
    }

    public function test_reject_requires_reason(): void
    {
        $doctor = $this->actingAsDoctor();
        $appointment = Appointment::factory()->create(['doctor_id' => $doctor->id]);
        Payment::factory()->create(['appointment_id' => $appointment->id]);

        $this->postJson("/api/doctor/appointments/{$appointment->id}/payment/reject", [])
            ->assertStatus(422)->assertJsonValidationErrors('reason');
    }

    public function test_manual_cash_booking_is_confirmed_and_approved(): void
    {
        $doctor = $this->actingAsDoctor();

        $response = $this->postJson('/api/doctor/appointments/manual', [
            'starts_at' => '2026-06-07T15:00:00',
            'patient_name' => 'زائر',
            'patient_phone' => '770000000',
            'payment_method' => 'cash',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'confirmed')
            ->assertJsonPath('data.payment.status', 'approved')
            ->assertJsonPath('data.payment.method', 'cash');

        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $doctor->id,
            'patient_name' => 'زائر',
            'status' => 'confirmed',
        ]);
    }

    public function test_doctor_cannot_manage_another_doctors_appointment(): void
    {
        $this->actingAsDoctor();
        $other = Appointment::factory()->create(); // طبيب آخر

        $this->patchJson("/api/doctor/appointments/{$other->id}/status", [
            'status' => 'completed',
        ])->assertForbidden();
    }
}
