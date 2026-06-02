<?php

namespace App\Services\Booking;

use App\Enums\AppointmentStatus;
use App\Models\Doctor;
use Carbon\Carbon;
use Carbon\CarbonInterface;

/**
 * توليد الفترات الزمنية المتاحة (slots) لطبيب في يوم معيّن، اعتماداً على أوقات
 * عمله وطرح المواعيد المحجوزة والفترات الماضية.
 */
class SlotService
{
    /**
     * @return list<array{time: string, starts_at: string, ends_at: string}>
     */
    public function availableSlots(Doctor $doctor, CarbonInterface $date): array
    {
        $dateString = $date->toDateString();

        $blocks = $doctor->workingHours()
            ->where('day_of_week', $date->dayOfWeek)
            ->where('is_active', true)
            ->get();

        if ($blocks->isEmpty()) {
            return [];
        }

        // أوقات البدء المحجوزة (بالحالات التي تشغل الموعد) لهذا اليوم.
        $booked = $doctor->appointments()
            ->whereDate('starts_at', $dateString)
            ->whereIn('status', AppointmentStatus::blocking())
            ->get(['starts_at'])
            ->map(fn ($a) => $a->starts_at->format('H:i'))
            ->all();

        $now = Carbon::now();
        $slots = [];

        foreach ($blocks as $block) {
            $cursor = Carbon::parse("{$dateString} {$block->start_time}");
            $end = Carbon::parse("{$dateString} {$block->end_time}");
            $duration = max(5, (int) $block->slot_duration);

            while ($cursor->copy()->addMinutes($duration)->lessThanOrEqualTo($end)) {
                $slotEnd = $cursor->copy()->addMinutes($duration);
                $time = $cursor->format('H:i');

                $isPast = $cursor->lessThanOrEqualTo($now);
                $isBooked = in_array($time, $booked, true);

                if (! $isPast && ! $isBooked && ! isset($slots[$time])) {
                    $slots[$time] = [
                        'time' => $time,
                        'starts_at' => $cursor->toIso8601String(),
                        'ends_at' => $slotEnd->toIso8601String(),
                    ];
                }

                $cursor->addMinutes($duration);
            }
        }

        ksort($slots);

        return array_values($slots);
    }

    /**
     * هل وقت البدء المطلوب فترةً صالحةً ضمن أوقات عمل الطبيب وغير ماضية؟
     */
    public function isValidSlot(Doctor $doctor, CarbonInterface $startsAt): bool
    {
        foreach ($this->availableSlots($doctor, $startsAt) as $slot) {
            if (Carbon::parse($slot['starts_at'])->equalTo($startsAt)) {
                return true;
            }
        }

        return false;
    }
}
