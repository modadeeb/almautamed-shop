<?php

namespace App\Http\Requests\Doctor;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ManualBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isDoctor() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'starts_at' => ['required', 'date'],
            'patient_name' => ['required', 'string', 'max:255'],
            'patient_phone' => ['required', 'string', 'regex:/^\+?[0-9]{9,15}$/'],
            'payment_method' => ['required', Rule::in([
                PaymentMethod::Cash->value,
                PaymentMethod::KarimiTransfer->value,
            ])],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'starts_at' => 'وقت الموعد',
            'patient_name' => 'اسم المريض',
            'patient_phone' => 'هاتف المريض',
            'payment_method' => 'طريقة الدفع',
            'amount' => 'المبلغ',
        ];
    }
}
