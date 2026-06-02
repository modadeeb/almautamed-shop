import { Link } from 'react-router-dom'
import { useMyAppointments } from '@/features/booking/hooks'
import { StatusBadge } from '@/components/StatusBadge'
import { PageSkeleton } from '@/components/Skeleton'

export default function MyAppointments() {
  const { data, isPending, isError } = useMyAppointments()

  if (isPending) return <PageSkeleton />
  if (isError) {
    return <p className="py-8 text-center text-danger">تعذّر تحميل حجوزاتك.</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-primary-dark">حجوزاتي</h1>

      {data && data.length === 0 ? (
        <div className="card text-center">
          <p className="text-ink-muted">لا توجد حجوزات بعد.</p>
          <Link to="/doctors" className="btn-primary mt-4">
            احجز موعداً
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((appt) => {
            const start = new Date(appt.starts_at)
            return (
              <div key={appt.id} className="card space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{appt.doctor?.name}</h2>
                    <p className="text-sm text-ink-muted">
                      {appt.doctor?.specialty?.name}
                      {appt.doctor?.clinic_name
                        ? ` — ${appt.doctor.clinic_name}`
                        : ''}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} label={appt.status_label} />
                </div>

                <p className="text-sm">
                  {start.toLocaleDateString('ar', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  —{' '}
                  <span className="font-semibold text-primary">
                    {start.toLocaleTimeString('ar', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>

                {appt.payment && (
                  <p className="text-xs text-ink-muted">
                    الدفع: {appt.payment.status_label}
                    {appt.payment.rejection_reason
                      ? ` (${appt.payment.rejection_reason})`
                      : ''}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
