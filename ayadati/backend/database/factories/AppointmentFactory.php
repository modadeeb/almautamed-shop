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
        $start = now()->addDay()->setTime(9, 0);

        return [
            'doctor_id' => Doctor::factory(),
            'patient_id' => User::factory()->patient(),
            'starts_at' => $start,
            'ends_at' => $start->copy()->addMinutes(30),
            'status' => AppointmentStatus::Pending,
        ];
    }
}
