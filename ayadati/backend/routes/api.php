<?php

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

// المستخدم الحالي (مصادقة Sanctum).
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
