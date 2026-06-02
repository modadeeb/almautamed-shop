import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useApprovePayment,
  useDoctorAppointments,
  useRejectPayment,
  useUpdateStatus,
} from '@/features/doctor/hooks'
import { StatusBadge } from '@/components/StatusBadge'
import { ReceiptImage } from '@/components/ReceiptImage'
import { PageSkeleton } from '@/components/Skeleton'
import type { Appointment } from '@/features/booking/types'

const STATUS_ACTIONS: { value: string; label: string }[] = [
  { value: 'confirmed', label: 'تأكيد' },
  { value: 'completed', label: 'اكتمل' },
  { value: 'no_show', label: 'لم يحضر' },
  { value: 'cancelled', label: 'إلغاء' },
]

function AppointmentRow({ appt }: { appt: Appointment }) {
  const [showReceipt, setShowReceipt] = useState(false)
  const updateStatus = useUpdateStatus()
  const approve = useApprovePayment()
  const reject = useRejectPayment()

  const start = new Date(appt.starts_at)
  const pendingReceipt =
    appt.payment?.has_receipt && appt.payment.status === 'pending'

  return (
    <div className="card space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{appt.patient_name ?? 'مريض'}</h3>
          <p className="text-sm text-ink-muted">
            {start.toLocaleDateString('ar', { month: 'long', day: 'numeric' })} —{' '}
            {start.toLocaleTimeString('ar', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {appt.patient_phone && (
            <p className="text-xs text-ink-muted">{appt.patient_phone}</p>
          )}
        </div>
        <StatusBadge status={appt.status} label={appt.status_label} />
      </div>

      {/* مراجعة الإيصال */}
      {pendingReceipt && (
        <div className="rounded bg-surface-muted/50 p-2">
          <button
            type="button"
            onClick={() => setShowReceipt((s) => !s)}
            className="text-sm font-semibold text-primary"
          >
            {showReceipt ? 'إخفاء الإيصال' : 'مراجعة الإيصال'}
          </button>
          {showReceipt && (
            <div className="mt-2 space-y-2">
              <ReceiptImage appointmentId={appt.id} />
              <p className="text-xs text-ink-muted">
                رقم العملية: {appt.payment?.transaction_ref ?? '—'} · المبلغ:{' '}
                {appt.payment?.amount}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => approve.mutate(appt.id)}
                  disabled={approve.isPending}
                  className="rounded bg-secondary px-3 py-1.5 text-sm font-semibold text-white"
                >
                  اعتماد الدفع
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const reason = window.prompt('سبب رفض الإيصال:')
                    if (reason) reject.mutate({ id: appt.id, reason })
                  }}
                  disabled={reject.isPending}
                  className="rounded border border-danger px-3 py-1.5 text-sm font-semibold text-danger"
                >
                  رفض
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* إجراءات الحالة */}
      <div className="flex flex-wrap gap-2">
        {STATUS_ACTIONS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => updateStatus.mutate({ id: appt.id, status: a.value })}
            disabled={updateStatus.isPending || appt.status === a.value}
            className="rounded border border-line px-2.5 py-1 text-xs disabled:opacity-40"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Appointments() {
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const { data, isPending, isError } = useDoctorAppointments({
    date: date || undefined,
    status: status || undefined,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-primary-dark">المواعيد</h1>
        <Link
          to="/doctor/manual-booking"
          className="rounded bg-primary px-3 py-1.5 text-sm font-semibold text-white"
        >
          + حجز يدوي
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-line px-3 py-1.5 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border border-line px-3 py-1.5 text-sm"
        >
          <option value="">كل الحالات</option>
          <option value="pending">بانتظار التأكيد</option>
          <option value="confirmed">مؤكَّد</option>
          <option value="completed">مكتمل</option>
          <option value="no_show">لم يحضر</option>
          <option value="cancelled">ملغى</option>
        </select>
      </div>

      {isError && <p className="text-danger">تعذّر تحميل المواعيد.</p>}
      {isPending ? (
        <PageSkeleton />
      ) : data && data.length === 0 ? (
        <p className="py-8 text-center text-ink-muted">لا توجد مواعيد.</p>
      ) : (
        <div className="space-y-3">
          {data?.map((appt) => <AppointmentRow key={appt.id} appt={appt} />)}
        </div>
      )}
    </div>
  )
}
