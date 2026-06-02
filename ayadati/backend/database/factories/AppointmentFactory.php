<?php

namespace Database\Factories;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        // وقت بدء متغيّر لتقليل تصادم القيد الفريد (doctor_id, starts_at).
        $start = now()
            ->addDays(fake()->numberBetween(1, 30))
            ->setTime(fake()->numberBetween(8, 17), fake()->randomElement([0, 30]), 0);

        return [
            'doctor_id' => Doctor::factory(),
            'patient_id' => User::factory()->patient(),
            'starts_at' => $start,
            'ends_at' => $start->copy()->addMinutes(30),
            'status' => AppointmentStatus::Pending,
        ];
    }
}
