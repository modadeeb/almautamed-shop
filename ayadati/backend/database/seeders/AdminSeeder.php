<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * إنشاء حساب مدير المنصّة الافتراضي (تُضبط القيم عبر .env في الإنتاج).
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@ayadati.test');

        User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => 'مدير المنصّة',
                'phone' => env('ADMIN_PHONE', '700000000'),
                'role' => UserRole::Admin,
                'is_active' => true,
                'email_verified_at' => now(),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
            ],
        );
    }
}
