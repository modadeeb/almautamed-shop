<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPatient() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'starts_at' => ['required', 'date', 'after:now'],
            'transaction_ref' => ['required', 'string', 'max:100'],
            // إيصال صورة فقط، بحجم معقول (≤ 4MB) — تحقّق صارم من النوع.
            'receipt' => ['required', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
            'patient_name' => ['nullable', 'string', 'max:255'],
            'patient_phone' => ['nullable', 'string', 'regex:/^\+?[0-9]{9,15}$/'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'starts_at' => 'وقت الموعد',
            'transaction_ref' => 'رقم عملية التحويل',
            'receipt' => 'صورة الإيصال',
            'patient_name' => 'اسم المريض',
            'patient_phone' => 'هاتف المريض',
            'notes' => 'ملاحظات',
        ];
    }

    public function messages(): array
    {
        return [
            'receipt.image' => 'يجب أن يكون الإيصال صورة (JPG أو PNG أو WebP).',
            'receipt.max' => 'حجم صورة الإيصال يجب ألا يتجاوز 4 ميغابايت.',
        ];
    }
}
