<?php

namespace App\Services\Booking;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Services\Booking\Exceptions\SlotUnavailableException;
use Carbon\CarbonInterface;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

/**
 * إنشاء المواعيد مع منع الحجز المزدوج على مستويين:
 * 1) تحقّق منطقي أن الفترة ضمن أوقات عمل الطبيب وغير محجوزة/ماضية.
 * 2) قيد فريد (doctor_id, starts_at) على مستوى قاعدة البيانات لمنع التسابق.
 */
class BookingService
{
    public function __construct(private readonly SlotService $slots)
    {
    }

    /**
     * حجز موعد ضمن معاملة (transaction).
     *
     * @param  array<string, mixed>  $attributes  بيانات إضافية (patient_id، الاسم، الهاتف، notes…)
     *
     * @throws SlotUnavailableException
     */
    public function book(
        Doctor $doctor,
        CarbonInterface $startsAt,
        AppointmentStatus $status = AppointmentStatus::Pending,
        array $attributes = [],
    ): Appointment {
        if (! $this->slots->isValidSlot($doctor, $startsAt)) {
            throw new SlotUnavailableException;
        }

        // مدة الكشف من أوقات العمل لذلك اليوم لحساب وقت الانتهاء.
        $duration = (int) ($doctor->workingHours()
            ->where('day_of_week', $startsAt->dayOfWeek)
            ->where('is_active', true)
            ->value('slot_duration') ?? 30);

        try {
            return DB::transaction(function () use ($doctor, $startsAt, $status, $attributes, $duration) {
                return $doctor->appointments()->create(array_merge([
                    'starts_at' => $startsAt,
                    'ends_at' => $startsAt->copy()->addMinutes($duration),
                    'status' => $status,
                ], $attributes));
            });
        } catch (QueryException $e) {
            // انتهاك القيد الفريد ⇒ حُجزت الفترة للتوّ من طلب آخر.
            if ($this->isUniqueViolation($e)) {
                throw new SlotUnavailableException;
            }
            throw $e;
        }
    }

    private function isUniqueViolation(QueryException $e): bool
    {
        // 23000/23505 ترميز انتهاك التكامل في MySQL/Postgres؛ وSQLite يحوي النص.
        $code = (string) $e->getCode();

        return in_array($code, ['23000', '23505'], true)
            || str_contains($e->getMessage(), 'UNIQUE constraint failed');
    }
}
