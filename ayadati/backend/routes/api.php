<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HealthController;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::get('/user', [AuthController::class, 'me'])->name('auth.me');

    // أمثلة مسارات محميّة بالأدوار (تُستبدل بوظائف فعلية في المراحل التالية).
    Route::get('/admin/ping', fn () => response()->json(['ok' => true, 'scope' => 'admin']))
        ->middleware('role:admin');
    Route::get('/doctor/ping', fn () => response()->json(['ok' => true, 'scope' => 'doctor']))
        ->middleware('role:doctor');
    Route::get('/patient/ping', fn () => response()->json(['ok' => true, 'scope' => 'patient']))
        ->middleware('role:patient');
});
