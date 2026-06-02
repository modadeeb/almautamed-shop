<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Specialty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            SpecialtySeeder::class,
        ]);

        // أطباء تجريبيون للبحث (يعيدون استخدام التخصّصات المزروعة).
        Doctor::factory(15)
            ->recycle(Specialty::all())
            ->create();
    }
}
