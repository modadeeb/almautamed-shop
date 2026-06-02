<?php

namespace App\Http\Requests\Doctor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        // المسار محميّ بـ role:doctor؛ الطبيب يعدّل ملفه الخاص فقط.
        return $this->user()?->isDoctor() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'specialty_id' => ['required', 'integer', 'exists:specialties,id'],
            'clinic_name' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:70'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'specialty_id' => 'التخصّص',
            'clinic_name' => 'اسم العيادة',
            'city' => 'المدينة',
            'address' => 'العنوان',
            'bio' => 'نبذة',
            'years_experience' => 'سنوات الخبرة',
        ];
    }
}
