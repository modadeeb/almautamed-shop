<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\UpdateDoctorProfileRequest;
use App\Http\Resources\DoctorResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * ملف الطبيب الخاص بالمستخدم الحالي.
     */
    public function show(Request $request): DoctorResource
    {
        $request->user()->doctor()->firstOrCreate([]);
        // إعادة جلب نظيفة حتى لا يُرجع المورد حالة 201 (wasRecentlyCreated).
        $doctor = $request->user()->doctor()->with(['user:id,name', 'specialty'])->first();

        return new DoctorResource($doctor);
    }

    /**
     * تحديث ملف الطبيب الخاص. يُنشر الملف تلقائياً عند اكتمال الحقول الأساسية.
     */
    public function update(UpdateDoctorProfileRequest $request): DoctorResource
    {
        $doctor = $request->user()->doctor()->firstOrCreate([]);

        $doctor->fill($request->validated());
        // يصبح الطبيب ظاهراً في البحث عند اكتمال التخصّص واسم العيادة والمدينة.
        $doctor->is_published = (bool) ($doctor->specialty_id && $doctor->clinic_name && $doctor->city);
        $doctor->save();

        // إعادة جلب نظيفة حتى لا يُرجع المورد حالة 201 (wasRecentlyCreated).
        $doctor = $request->user()->doctor()->with(['user:id,name', 'specialty'])->first();

        return new DoctorResource($doctor);
    }
}
