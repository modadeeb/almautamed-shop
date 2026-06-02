<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case KarimiTransfer = 'karimi_transfer'; // إيداع/تحويل لحساب بنك الكريمي
    case Cash = 'cash';                       // دفع نقدي (حجز يدوي في العيادة)

    public function label(): string
    {
        return match ($this) {
            self::KarimiTransfer => 'تحويل بنك الكريمي',
            self::Cash => 'نقداً',
        };
    }
}
