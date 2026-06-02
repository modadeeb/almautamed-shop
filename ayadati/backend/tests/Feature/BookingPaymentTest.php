<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\User;
use App\Models\WorkingHour;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BookingPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-06-07 07:00:00')); // الأحد صباحاً
        Storage::fake('local');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function doctorWithHours(int $fee = 3000): Doctor
    {
        $doctor = Doctor::factory()->create(['consultation_fee' => $fee]);
        WorkingHour::factory()->create([
            'doctor_id' => $doctor->id,
            'day_of_week' => 0,
            'start_time' => '09:00',
            'end_time' => '11:00',
            'slot_duration' => 30,
        ]);

        return $doctor;
    }

    private function actingAsPatient(): User
    {
        $patient = User::factory()->patient()->create();
        $this->withHeader('Authorization', 'Bearer '.$patient->createToken('t')->plainTextToken);

        return $patient;
    }

    public function test_patient_can_book_with_receipt_and_payment_is_pending(): void
    {
        $doctor = $this->doctorWithHours(3000);
        $this->actingAsPatient();

        $response = $this->postJson("/api/doctors/{$doctor->id}/appointments", [
            'starts_at' => '2026-06-07T09:00:00',
            'transaction_ref' => '778899',
            'receipt' => UploadedFile::fake()->image('receipt.jpg', 600, 800),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.payment.status', 'pending')
            ->assertJsonPath('data.payment.amount', '3000.00');

        $this->assertDatabaseHas('appointments', ['doctor_id' => $doctor->id, 'status' => 'pending']);
        $this->assertDatabaseHas('payments', ['transaction_ref' => '778899', 'status' => 'pending']);

        // الإيصال خُزّن على القرص الخاص.
        $path = \App\Models\Payment::first()->receipt_path;
        Storage::disk('local')->assertExists($path);
    }

    public function test_receipt_is_required(): void
    {
        $doctor = $this->doctorWithHours();
        $this->actingAsPatient();

        $this->postJson("/api/doctors/{$doctor->id}/appointments", [
            'starts_at' => '2026-06-07T09:00:00',
            'transaction_ref' => '778899',
        ])->assertStatus(422)->assertJsonValidationErrors('receipt');
    }

    public function test_non_image_receipt_is_rejected(): void
    {
        $doctor = $this->doctorWithHours();
        $this->actingAsPatient();

        $this->postJson("/api/doctors/{$doctor->id}/appointments", [
            'starts_at' => '2026-06-07T09:00:00',
            'transaction_ref' => '778899',
            'receipt' => UploadedFile::fake()->create('virus.pdf', 100, 'application/pdf'),
        ])->assertStatus(422)->assertJsonValidationErrors('receipt');
    }

    public function test_double_booking_returns_409_and_no_orphan_file(): void
    {
        $doctor = $this->doctorWithHours();
        $this->actingAsPatient();

        $this->postJson("/api/doctors/{$doctor->id}/appointments", [
            'starts_at' => '2026-06-07T09:00:00',
            'transaction_ref' => '111',
            'receipt' => UploadedFile::fake()->image('a.jpg'),
        ])->assertCreated();

        // مريض آخر يحاول نفس الفترة.
        $this->actingAsPatient();
        $this->postJson("/api/doctors/{$doctor->id}/appointments", [
            'starts_at' => '2026-06-07T09:00:00',
            'transaction_ref' => '222',
            'receipt' => UploadedFile::fake()->image('b.jpg'),
        ])->assertStatus(409);

        // لم يُنشأ سوى دفع واحد (لا ملف يتيم في DB).
        $this->assertDatabaseCount('payments', 1);
    }

    public function test_patient_sees_only_own_appointments(): void
    {
        $doctor = $this->doctorWithHours();
        $mine = User::factory()->patient()->create();
        $other = User::factory()->patient()->create();

        \App\Models\Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $mine->id,
            'starts_at' => Carbon::parse('2026-06-08 09:00'),
            'ends_at' => Carbon::parse('2026-06-08 09:30'),
        ]);
        \App\Models\Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $other->id,
            'starts_at' => Carbon::parse('2026-06-08 10:00'),
            'ends_at' => Carbon::parse('2026-06-08 10:30'),
        ]);

        $this->withHeader('Authorization', 'Bearer '.$mine->createToken('t')->plainTextToken)
            ->getJson('/api/my/appointments')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    /**
     * تجهيز موعد بإيصال مخزّن، وإرجاع [الموعد، صاحبه، الطبيب].
     *
     * @return array{0: \App\Models\Appointment, 1: User, 2: Doctor}
     */
    private function appointmentWithReceipt(): array
    {
        $doctor = $this->doctorWithHours();
        $owner = User::factory()->patient()->create();
        $appointment = \App\Models\Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $owner->id,
        ]);
        \App\Models\Payment::factory()->create([
            'appointment_id' => $appointment->id,
            'receipt_path' => 'receipts/test/r.jpg',
        ]);
        Storage::disk('local')->put('receipts/test/r.jpg', 'fake-bytes');

        return [$appointment, $owner, $doctor];
    }

    public function test_other_patient_cannot_view_receipt(): void
    {
        [$appointment] = $this->appointmentWithReceipt();
        $intruder = User::factory()->patient()->create();

        $this->withHeader('Authorization', 'Bearer '.$intruder->createToken('t')->plainTextToken)
            ->get("/api/appointments/{$appointment->id}/receipt")
            ->assertForbidden();
    }

    public function test_owner_can_view_receipt(): void
    {
        [$appointment, $owner] = $this->appointmentWithReceipt();

        $this->withHeader('Authorization', 'Bearer '.$owner->createToken('t')->plainTextToken)
            ->get("/api/appointments/{$appointment->id}/receipt")
            ->assertOk();
    }

    public function test_appointment_doctor_can_view_receipt(): void
    {
        [$appointment, , $doctor] = $this->appointmentWithReceipt();

        $this->withHeader('Authorization', 'Bearer '.$doctor->user->createToken('t')->plainTextToken)
            ->get("/api/appointments/{$appointment->id}/receipt")
            ->assertOk();
    }
}
