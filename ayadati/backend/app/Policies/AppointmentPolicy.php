<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * من يستطيع عرض الموعد/إيصاله: المريض صاحبه، طبيب الموعد، أو الأدمن.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isPatient()) {
            return $appointment->patient_id === $user->id;
        }

        if ($user->isDoctor()) {
            return $appointment->doctor->user_id === $user->id;
        }

        return false;
    }

    /**
     * من يدير حالة الموعد (تأكيد/إلغاء…): طبيب الموعد أو الأدمن. (يُستخدم في M5.)
     */
    public function manage(User $user, Appointment $appointment): bool
    {
        return $user->isAdmin()
            || ($user->isDoctor() && $appointment->doctor->user_id === $user->id);
    }
}
