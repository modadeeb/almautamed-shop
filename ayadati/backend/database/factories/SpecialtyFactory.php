<?php

namespace Database\Factories;

use App\Models\Specialty;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Specialty>
 */
class SpecialtyFactory extends Factory
{
    protected $model = Specialty::class;

    public function definition(): array
    {
        $name = fake()->randomElement([
            'باطنية', 'أطفال', 'جلدية', 'عظام', 'نساء وولادة', 'أسنان',
            'عيون', 'أنف وأذن وحنجرة', 'قلب', 'مخ وأعصاب',
        ]);

        // المعرّف (slug) فريد دائماً عبر لاحقة رقمية فريدة.
        return [
            'name' => $name,
            'slug' => 'spec-'.fake()->unique()->numberBetween(1, 9999999),
            'is_active' => true,
        ];
    }
}
