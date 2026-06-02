<?php

namespace App\Http\Resources;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Doctor */
class DoctorResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->whenLoaded('user', fn () => $this->user->name),
            'specialty' => new SpecialtyResource($this->whenLoaded('specialty')),
            'clinic_name' => $this->clinic_name,
            'city' => $this->city,
            'address' => $this->address,
            'bio' => $this->bio,
            'years_experience' => $this->years_experience,
            'photo_url' => $this->photo_path
                ? Storage::disk('public')->url($this->photo_path)
                : null,
        ];
    }
}
