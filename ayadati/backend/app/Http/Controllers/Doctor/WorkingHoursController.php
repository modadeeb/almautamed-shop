<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\SyncWorkingHoursRequest;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkingHoursController extends Controller
{
    /**
     * أوقات عمل الطبيب الحالي.
     */
    public function index(Request $request): JsonResponse
    {
        $doctor = $request->user()->doctor()->firstOrCreate([]);

        return response()->json([
            'data' => $doctor->workingHours()->orderBy('day_of_week')->orderBy('start_time')->get(),
        ]);
    }

    /**
     * استبدال مجموعة أوقات العمل بالكامل (مزامنة) ضمن معاملة.
     */
    public function sync(SyncWorkingHoursRequest $request): JsonResponse
    {
        /** @var Doctor $doctor */
        $doctor = $request->user()->doctor()->firstOrCreate([]);

        DB::transaction(function () use ($doctor, $request) {
            $doctor->workingHours()->delete();

            foreach ($request->validated('hours') as $block) {
                $doctor->workingHours()->create([
                    'day_of_week' => $block['day_of_week'],
                    'start_time' => $block['start_time'],
                    'end_time' => $block['end_time'],
                    'slot_duration' => $block['slot_duration'],
                    'is_active' => $block['is_active'] ?? true,
                ]);
            }
        });

        return response()->json([
            'data' => $doctor->workingHours()->orderBy('day_of_week')->orderBy('start_time')->get(),
        ]);
    }
}
