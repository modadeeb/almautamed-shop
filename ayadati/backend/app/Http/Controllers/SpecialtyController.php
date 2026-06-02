<?php

namespace App\Http\Controllers;

use App\Http\Resources\SpecialtyResource;
use App\Models\Specialty;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class SpecialtyController extends Controller
{
    /**
     * قائمة التخصّصات النشطة — بيانات مرجعية مخزّنة مؤقتاً لتسريع التحميل.
     */
    public function index(): AnonymousResourceCollection
    {
        $specialties = Cache::remember('specialties.active', now()->addHour(), function () {
            return Specialty::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get();
        });

        return SpecialtyResource::collection($specialties);
    }
}
