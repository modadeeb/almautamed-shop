<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * فحص صحة الـ API واتصال قاعدة البيانات.
     */
    public function __invoke(): JsonResponse
    {
        $database = 'ok';
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $database = 'down';
        }

        return response()->json([
            'status' => $database === 'ok' ? 'ok' : 'degraded',
            'app' => config('app.name'),
            'time' => now()->toIso8601String(),
            'database' => $database,
        ], $database === 'ok' ? 200 : 503);
    }
}
