<?php

namespace App\Http\Requests\Doctor;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class SyncWorkingHoursRequest extends FormRequest
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
            'hours' => ['present', 'array'],
            'hours.*.day_of_week' => ['required', 'integer', 'between:0,6'],
            'hours.*.start_time' => ['required', 'date_format:H:i'],
            'hours.*.end_time' => ['required', 'date_format:H:i'],
            'hours.*.slot_duration' => ['required', 'integer', 'min:5', 'max:240'],
            'hours.*.is_active' => ['boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            foreach ((array) $this->input('hours', []) as $i => $block) {
                $start = $block['start_time'] ?? null;
                $end = $block['end_time'] ?? null;
                if ($start && $end && $end <= $start) {
                    $validator->errors()->add(
                        "hours.{$i}.end_time",
                        'وقت النهاية يجب أن يكون بعد وقت البداية.'
                    );
                }
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'hours' => 'أوقات العمل',
            'hours.*.start_time' => 'وقت البداية',
            'hours.*.end_time' => 'وقت النهاية',
            'hours.*.slot_duration' => 'مدة الكشف',
            'hours.*.day_of_week' => 'اليوم',
        ];
    }
}
