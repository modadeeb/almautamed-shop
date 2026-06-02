<?php

namespace App\Http\Requests\Doctor;

use App\Enums\AppointmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppointmentStatusRequest extends FormRequest
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
            // الطبيب يضبط هذه الحالات فقط (لا "pending").
            'status' => ['required', Rule::in([
                AppointmentStatus::Confirmed->value,
                AppointmentStatus::Completed->value,
                AppointmentStatus::NoShow->value,
                AppointmentStatus::Cancelled->value,
            ])],
        ];
    }

    public function attributes(): array
    {
        return ['status' => 'الحالة'];
    }
}
