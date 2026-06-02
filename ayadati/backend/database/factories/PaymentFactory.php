<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Appointment;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'appointment_id' => Appointment::factory(),
            'amount' => 3000,
            'method' => PaymentMethod::KarimiTransfer,
            'status' => PaymentStatus::Pending,
            'transaction_ref' => (string) fake()->numberBetween(100000, 999999),
            'receipt_path' => 'receipts/test/sample.jpg',
        ];
    }
}
