<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Doctor;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Doctor>
 */
class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state(['role' => UserRole::Doctor]),
            'specialty_id' => Specialty::factory(),
            'clinic_name' => 'عيادة '.fake()->randomElement(['النور', 'الشفاء', 'الحياة', 'الرحمة']),
            'city' => fake()->randomElement(['صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب']),
            'address' => 'شارع '.fake()->randomElement(['الستين', 'الزبيري', 'حدة', 'الخمسين']),
            'bio' => 'طبيب متخصّص بخبرة واسعة في تقديم أفضل رعاية للمرضى.',
            'years_experience' => fake()->numberBetween(1, 30),
            'is_published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn () => ['is_published' => false]);
    }
}
