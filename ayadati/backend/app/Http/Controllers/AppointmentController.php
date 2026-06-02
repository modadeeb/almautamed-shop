<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Services\Booking\BookingService;
use App\Services\ReceiptStorageService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly BookingService $booking,
        private readonly ReceiptStorageService $receipts,
    ) {
    }

    /**
     * حجوزات المريض الحالي.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $appointments = $request->user()
            ->appointmentsAsPatient()
            ->with(['doctor.user:id,name', 'doctor.specialty', 'payment'])
            ->latest('starts_at')
            ->paginate(10);

        return AppointmentResource::collection($appointments);
    }

    /**
     * حجز موعد لدى طبيب مع دفع عبر تحويل الكريمي ورفع الإيصال — ضمن معاملة.
     */
    public function store(StoreAppointmentRequest $request, Doctor $doctor): JsonResponse
    {
        abort_unless($doctor->is_published, 404);

        $data = $request->validated();
        $user = $request->user();
        $startsAt = Carbon::parse($data['starts_at']);

        // نخزّن الإيصال أولاً، ونحذفه إن فشلت المعاملة لتفادي ملف يتيم.
        $receiptPath = $this->receipts->store($request->file('receipt'));

        try {
            $appointment = DB::transaction(function () use ($doctor, $startsAt, $user, $data, $receiptPath) {
                $appointment = $this->booking->book(
                    $doctor,
                    $startsAt,
                    AppointmentStatus::Pending,
                    [
                        'patient_id' => $user->id,
                        'patient_name' => $data['patient_name'] ?? $user->name,
                        'patient_phone' => $data['patient_phone'] ?? $user->phone,
                        'notes' => $data['notes'] ?? null,
                    ],
                );

                $appointment->payment()->create([
                    'amount' => $doctor->consultation_fee,
                    'method' => PaymentMethod::KarimiTransfer,
                    'status' => PaymentStatus::Pending,
                    'receipt_path' => $receiptPath,
                    'transaction_ref' => $data['transaction_ref'],
                ]);

                return $appointment;
            });
        } catch (\Throwable $e) {
            $this->receipts->delete($receiptPath);
            throw $e;
        }

        $appointment->load(['doctor.user:id,name', 'doctor.specialty', 'payment']);

        return (new AppointmentResource($appointment))->response()->setStatusCode(201);
    }

    /**
     * عرض صورة إيصال الموعد (مخوّل: المريض صاحبه/طبيب الموعد/الأدمن).
     */
    public function receipt(Appointment $appointment): StreamedResponse
    {
        Gate::authorize('view', $appointment);

        $payment = $appointment->payment;
        abort_unless($payment && $payment->receipt_path, 404);

        return Storage::disk($this->receipts->disk())->response($payment->receipt_path);
    }
}
