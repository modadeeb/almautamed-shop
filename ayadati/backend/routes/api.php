<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Doctor\ProfileController as DoctorProfileController;
use App\Http\Controllers\Doctor\WorkingHoursController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DoctorSlotController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\SpecialtyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| مسارات الـ API لمنصة «عيادتي»
|--------------------------------------------------------------------------
*/

// فحص الصحة — عام، بلا مصادقة.
Route::get('/health', HealthController::class)->name('api.health');

/*
| المصادقة
| المسارات الحسّاسة (تسجيل/دخول) محميّة بتحديد معدّل صارم لمنع التخمين.
*/
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:6,1')
    ->name('auth.register');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('auth.login');

/*
| الأطباء والتخصّصات — مسارات عامة (بحث/تصفّح).
*/
Route::get('/specialties', [SpecialtyController::class, 'index'])->name('specialties.index');
Route::get('/doctors', [DoctorController::class, 'index'])->name('doctors.index');
Route::get('/doctors/{doctor}', [DoctorController::class, 'show'])->name('doctors.show');
Route::get('/doctors/{doctor}/slots', DoctorSlotController::class)->name('doctors.slots');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::get('/user', [AuthController::class, 'me'])->name('auth.me');

    // ملف الطبيب الخاص (إدارة ذاتية).
    Route::middleware('role:doctor')->group(function () {
        Route::get('/doctor/profile', [DoctorProfileController::class, 'show'])
            ->name('doctor.profile.show');
        Route::put('/doctor/profile', [DoctorProfileController::class, 'update'])
            ->name('doctor.profile.update');

        // أوقات العمل.
        Route::get('/doctor/working-hours', [WorkingHoursController::class, 'index'])
            ->name('doctor.working-hours.index');
        Route::put('/doctor/working-hours', [WorkingHoursController::class, 'sync'])
            ->name('doctor.working-hours.sync');
    });

    // نقاط فحص دور (smoke) للتأكد من عمل middleware:role.
    Route::get('/admin/ping', fn () => response()->json(['ok' => true, 'scope' => 'admin']))
        ->middleware('role:admin');
    Route::get('/doctor/ping', fn () => response()->json(['ok' => true, 'scope' => 'doctor']))
        ->middleware('role:doctor');
    Route::get('/patient/ping', fn () => response()->json(['ok' => true, 'scope' => 'patient']))
        ->middleware('role:patient');
});
