<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DoctorController extends Controller
{
    /**
     * بحث وقائمة الأطباء المنشورين، مع فلترة وترقيم صفحات.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $doctors = Doctor::query()
            ->published()
            ->with(['user:id,name', 'specialty'])
            // فلترة بالتخصّص (slug أو id).
            ->when($request->filled('specialty'), function ($query) use ($request) {
                $specialty = $request->string('specialty')->toString();
                $query->whereHas('specialty', function ($q) use ($specialty) {
                    $q->where('slug', $specialty)->orWhere('id', $specialty);
                });
            })
            // فلترة بالمدينة.
            ->when($request->filled('city'), function ($query) use ($request) {
                $query->where('city', $request->string('city')->toString());
            })
            // بحث بالاسم.
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = $request->string('q')->toString();
                $query->whereHas('user', function ($q) use ($term) {
                    $q->where('name', 'like', "%{$term}%");
                });
            })
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        return DoctorResource::collection($doctors);
    }

    /**
     * عرض ملف طبيب منشور.
     */
    public function show(Doctor $doctor): DoctorResource
    {
        abort_unless($doctor->is_published, 404);

        $doctor->load(['user:id,name', 'specialty']);

        return new DoctorResource($doctor);
    }
}
