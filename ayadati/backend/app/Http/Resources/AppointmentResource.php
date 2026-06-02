<?php

namespace App\Http\Resources;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Appointment */
class AppointmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'starts_at' => $this->starts_at->toIso8601String(),
            'ends_at' => $this->ends_at->toIso8601String(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'patient_name' => $this->patient_name,
            'patient_phone' => $this->patient_phone,
            'notes' => $this->notes,
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'patient' => $this->whenLoaded('patient', fn () => [
                'id' => $this->patient?->id,
                'name' => $this->patient?->name,
            ]),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
        ];
    }
}
