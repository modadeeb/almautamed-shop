<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        // الاسم العربي ← المعرّف اللاتيني (slug) المستخدم في روابط الفلترة.
        $specialties = [
            'باطنية' => 'internal-medicine',
            'أطفال' => 'pediatrics',
            'جلدية' => 'dermatology',
            'عظام' => 'orthopedics',
            'نساء وولادة' => 'obstetrics-gynecology',
            'أسنان' => 'dentistry',
            'عيون' => 'ophthalmology',
            'أنف وأذن وحنجرة' => 'ent',
            'قلب' => 'cardiology',
            'مخ وأعصاب' => 'neurology',
            'مسالك بولية' => 'urology',
            'نفسية' => 'psychiatry',
        ];

        foreach ($specialties as $name => $slug) {
            Specialty::query()->firstOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'is_active' => true],
            );
        }
    }
}
