<?php

namespace App\Http\Controllers\Doctor;

use App\Enums\AppointmentStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\ManualBookingRequest;
use App\Http\Requests\Doctor\UpdateAppointmentStatusRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\Booking\BookingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class AppointmentController extends Controller
{
    public function __construct(private readonly BookingService $booking)
    {
    }

    /**
     * مواعيد الطبيب الحالي، مع فلترة بالتاريخ والحالة.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $doctor = $request->user()->doctor()->firstOrCreate([]);

        $appointments = $doctor->appointments()
            ->with(['patient:id,name', 'payment'])
            ->when($request->filled('date'), fn ($q) => $q->whereDate('starts_at', $request->date('date')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')->toString()))
            ->orderBy('starts_at')
            ->paginate(20)
            ->withQueryString();

        return AppointmentResource::collection($appointments);
    }

    /**
     * تحديث حالة الموعد (تأكيد/اكتمل/لم يحضر/إلغاء).
     */
    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment): AppointmentResource
    {
        Gate::authorize('manage', $appointment);

        $appointment->update(['status' => $request->validated('status')]);
        $appointment->load(['patient:id,name', 'payment']);

        return new AppointmentResource($appointment);
    }

    /**
     * اعتماد إيصال الدفع ⇒ يصبح الموعد مؤكَّداً.
     */
    public function approvePayment(Request $request, Appointment $appointment): AppointmentResource
    {
        Gate::authorize('manage', $appointment);
        abort_unless($appointment->payment !== null, 404);

        DB::transaction(function () use ($appointment, $request) {
            $appointment->payment->update([
                'status' => PaymentStatus::Approved,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'rejection_reason' => null,
            ]);
            $appointment->update(['status' => AppointmentStatus::Confirmed]);
        });

        $appointment->load(['patient:id,name', 'payment']);

        return new AppointmentResource($appointment);
    }

    /**
     * رفض الإيصال ⇒ يُلغى الموعد وتُحرَّر الفترة.
     */
    public function rejectPayment(Request $request, Appointment $appointment): AppointmentResource
    {
        Gate::authorize('manage', $appointment);
        abort_unless($appointment->payment !== null, 404);

        $data = $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ], [], ['reason' => 'سبب الرفض']);

        DB::transaction(function () use ($appointment, $request, $data) {
            $appointment->payment->update([
                'status' => PaymentStatus::Rejected,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'rejection_reason' => $data['reason'],
            ]);
            $appointment->update(['status' => AppointmentStatus::Cancelled]);
        });

        $appointment->load(['patient:id,name', 'payment']);

        return new AppointmentResource($appointment);
    }

    /**
     * حجز يدوي لمريض حضر مباشرةً (مع خيار دفع نقدي) ⇒ مؤكَّد فوراً.
     */
    public function storeManual(ManualBookingRequest $request): JsonResponse
    {
        $doctor = $request->user()->doctor()->firstOrCreate([]);
        $data = $request->validated();
        $method = PaymentMethod::from($data['payment_method']);

        $appointment = DB::transaction(function () use ($doctor, $data, $method) {
            $appointment = $this->booking->book(
                $doctor,
                Carbon::parse($data['starts_at']),
                AppointmentStatus::Confirmed,
                [
                    'patient_name' => $data['patient_name'],
                    'patient_phone' => $data['patient_phone'],
                    'notes' => $data['notes'] ?? null,
                ],
                enforceSlot: false,
            );

            // الدفع النقدي يُعتمد فوراً؛ غيره يبقى بانتظار المراجعة.
            $appointment->payment()->create([
                'amount' => $data['amount'] ?? $doctor->consultation_fee,
                'method' => $method,
                'status' => $method === PaymentMethod::Cash
                    ? PaymentStatus::Approved
                    : PaymentStatus::Pending,
            ]);

            return $appointment;
        });

        $appointment->load(['patient:id,name', 'payment']);

        return (new AppointmentResource($appointment))->response()->setStatusCode(201);
    }
}
