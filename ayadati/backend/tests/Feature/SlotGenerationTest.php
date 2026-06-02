<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\WorkingHour;
use App\Services\Booking\SlotService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SlotGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // وقت ثابت: الأحد 2026-06-07 الساعة 7 صباحاً (قبل بداية الدوام).
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
            'day_of_week' => 0, // الأحد
            'start_time' => '09:00',
            'end_time' => '11:00',
            'slot_duration' => 30,
        ]);

        return $doctor;
    }

    public function test_generates_slots_from_working_hours(): void
    {
        $doctor = $this->doctorWithHours();

        $slots = app(SlotService::class)->availableSlots($doctor, Carbon::parse('2026-06-07'));

        // 09:00, 09:30, 10:00, 10:30 → 4 فترات (10:30+30=11:00 ضمن الحد).
        $this->assertCount(4, $slots);
        $this->assertSame('09:00', $slots[0]['time']);
        $this->assertSame('10:30', $slots[3]['time']);
    }

    public function test_booked_slot_is_excluded(): void
    {
        $doctor = $this->doctorWithHours();
        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'starts_at' => Carbon::parse('2026-06-07 09:30'),
            'ends_at' => Carbon::parse('2026-06-07 10:00'),
            'status' => AppointmentStatus::Confirmed,
        ]);

        $slots = app(SlotService::class)->availableSlots($doctor, Carbon::parse('2026-06-07'));
        $times = array_column($slots, 'time');

        $this->assertNotContains('09:30', $times);
        $this->assertCount(3, $slots);
    }

    public function test_cancelled_appointment_does_not_block_slot(): void
    {
        $doctor = $this->doctorWithHours();
        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'starts_at' => Carbon::parse('2026-06-07 09:30'),
            'ends_at' => Carbon::parse('2026-06-07 10:00'),
            'status' => AppointmentStatus::Cancelled,
        ]);

        $slots = app(SlotService::class)->availableSlots($doctor, Carbon::parse('2026-06-07'));

        $this->assertContains('09:30', array_column($slots, 'time'));
    }

    public function test_past_slots_are_excluded_for_today(): void
    {
        $doctor = $this->doctorWithHours();
        // الآن الساعة 9:45 من نفس اليوم.
        Carbon::setTestNow(Carbon::parse('2026-06-07 09:45:00'));

        $slots = app(SlotService::class)->availableSlots($doctor, Carbon::parse('2026-06-07'));
        $times = array_column($slots, 'time');

        $this->assertNotContains('09:00', $times);
        $this->assertNotContains('09:30', $times);
        $this->assertContains('10:00', $times);
    }

    public function test_no_slots_on_day_without_working_hours(): void
    {
        $doctor = $this->doctorWithHours();
        // الاثنين 2026-06-08 لا يوجد له دوام.
        $slots = app(SlotService::class)->availableSlots($doctor, Carbon::parse('2026-06-08'));

        $this->assertSame([], $slots);
    }

    public function test_slots_endpoint_returns_available_times(): void
    {
        $doctor = $this->doctorWithHours();

        $this->getJson("/api/doctors/{$doctor->id}/slots?date=2026-06-07")
            ->assertOk()
            ->assertJsonPath('date', '2026-06-07')
            ->assertJsonCount(4, 'slots');
    }
}
