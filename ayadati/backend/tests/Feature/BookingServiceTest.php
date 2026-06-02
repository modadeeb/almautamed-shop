<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Doctor;
use App\Models\User;
use App\Models\WorkingHour;
use App\Services\Booking\BookingService;
use App\Services\Booking\Exceptions\SlotUnavailableException;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingServiceTest extends TestCase
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

    private function doctorWithHours(): Doctor
    {
        $doctor = Doctor::factory()->create();
        WorkingHour::factory()->create([
            'doctor_id' => $doctor->id,
            'day_of_week' => 0,
            'start_time' => '09:00',
            'end_time' => '11:00',
            'slot_duration' => 30,
        ]);

        return $doctor;
    }

    public function test_can_book_a_valid_slot(): void
    {
        $doctor = $this->doctorWithHours();
        $patient = User::factory()->patient()->create();

        $appointment = app(BookingService::class)->book(
            $doctor,
            Carbon::parse('2026-06-07 09:00'),
            AppointmentStatus::Pending,
            ['patient_id' => $patient->id],
        );

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'doctor_id' => $doctor->id,
            'status' => 'pending',
        ]);
        // مدة الكشف 30 دقيقة ⇒ ينتهي 09:30.
        $this->assertSame('09:30', $appointment->ends_at->format('H:i'));
    }

    public function test_double_booking_same_slot_is_rejected(): void
    {
        $doctor = $this->doctorWithHours();
        $service = app(BookingService::class);

        $service->book($doctor, Carbon::parse('2026-06-07 09:00'));

        $this->expectException(SlotUnavailableException::class);
        $service->book($doctor, Carbon::parse('2026-06-07 09:00'));
    }

    public function test_booking_outside_working_hours_is_rejected(): void
    {
        $doctor = $this->doctorWithHours();

        $this->expectException(SlotUnavailableException::class);
        // 13:00 خارج الدوام (09:00-11:00).
        app(BookingService::class)->book($doctor, Carbon::parse('2026-06-07 13:00'));
    }

    public function test_unique_constraint_blocks_double_booking_at_db_level(): void
    {
        $doctor = $this->doctorWithHours();

        // أول حجز ينجح.
        app(BookingService::class)->book($doctor, Carbon::parse('2026-06-07 10:00'));

        // محاولة ثانية على نفس الوقت تُرفض (القيد الفريد + المنطق).
        $this->expectException(SlotUnavailableException::class);
        app(BookingService::class)->book($doctor, Carbon::parse('2026-06-07 10:00'));

        $this->assertDatabaseCount('appointments', 1);
    }
}
