<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Services\Booking\SlotService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorSlotController extends Controller
{
    public function __construct(private readonly SlotService $slots)
    {
    }

    /**
     * الفترات المتاحة لطبيب في تاريخ محدّد (عام، لإتمام الحجز).
     */
    public function __invoke(Request $request, Doctor $doctor): JsonResponse
    {
        abort_unless($doctor->is_published, 404);

        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today', 'before:+60 days'],
        ], [], ['date' => 'التاريخ']);

        $date = Carbon::parse($validated['date'])->startOfDay();

        return response()->json([
            'date' => $date->toDateString(),
            'slots' => $this->slots->availableSlots($doctor, $date),
        ]);
    }
}
