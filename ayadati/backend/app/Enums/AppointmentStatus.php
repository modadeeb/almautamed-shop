<?php

namespace App\Enums;

/**
 * حالات الموعد. (discriminated union على مستوى الواجهة أيضاً.)
 */
enum AppointmentStatus: string
{
    case Pending = 'pending';        // بانتظار تأكيد الدفع
    case Confirmed = 'confirmed';    // مؤكَّد
    case Completed = 'completed';    // اكتمل الكشف
    case NoShow = 'no_show';         // لم يحضر
    case Cancelled = 'cancelled';    // ملغى

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'بانتظار التأكيد',
            self::Confirmed => 'مؤكَّد',
            self::Completed => 'مكتمل',
            self::NoShow => 'لم يحضر',
            self::Cancelled => 'ملغى',
        };
    }

    /** الحالات التي تشغل الموعد فعلياً (تمنع الحجز المزدوج). */
    public static function blocking(): array
    {
        return [self::Pending->value, self::Confirmed->value, self::Completed->value, self::NoShow->value];
    }
}
