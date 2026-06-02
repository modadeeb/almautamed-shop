<?php

namespace App\Services\Booking\Exceptions;

use RuntimeException;

/**
 * يُرمى عند محاولة حجز فترة غير متاحة (محجوزة، خارج أوقات العمل، أو ماضية).
 */
class SlotUnavailableException extends RuntimeException
{
    public function __construct(string $message = 'هذه الفترة لم تعد متاحة. يُرجى اختيار وقت آخر.')
    {
        parent::__construct($message);
    }
}
