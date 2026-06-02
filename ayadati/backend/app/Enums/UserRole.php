<?php

namespace App\Enums;

/**
 * أدوار المستخدمين في المنصّة.
 */
enum UserRole: string
{
    case Admin = 'admin';
    case Doctor = 'doctor';
    case Patient = 'patient';

    /** الأدوار المسموح بها للتسجيل الذاتي (admin يُنشأ عبر seeder فقط). */
    public static function selfRegisterable(): array
    {
        return [self::Doctor->value, self::Patient->value];
    }

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'مدير المنصّة',
            self::Doctor => 'طبيب',
            self::Patient => 'مريض',
        };
    }
}
