<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';     // بانتظار مراجعة الإيصال
    case Approved = 'approved';   // اعتُمد الدفع
    case Rejected = 'rejected';   // رُفض الإيصال

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'بانتظار المراجعة',
            self::Approved => 'معتمد',
            self::Rejected => 'مرفوض',
        };
    }
}
