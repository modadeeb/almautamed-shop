import { Link, useLocation, useParams } from 'react-router-dom'
import type { Slot } from '@/features/schedule/types'

/**
 * صفحة إتمام الحجز. M3: تعرض ملخّص الموعد المختار.
 * تُستكمل ببيانات المريض والدفع ورفع الإيصال في M4.
 */
export default function BookingCheckout() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const slot = (location.state as { slot?: Slot } | null)?.slot ?? null

  if (!slot) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-ink-muted">لم يتم اختيار موعد.</p>
        <Link to={`/doctors/${id}`} className="btn-primary mt-4">
          اختيار موعد
        </Link>
      </div>
    )
  }

  const start = new Date(slot.starts_at)

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl text-primary-dark">إتمام الحجز</h1>

      <section className="card space-y-2">
        <h2 className="font-semibold">الموعد المختار</h2>
        <p className="text-ink-muted">
          {start.toLocaleDateString('ar', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className="text-lg font-semibold text-primary">{slot.time}</p>
      </section>

      <p className="rounded bg-tertiary-light p-3 text-sm text-tertiary">
        خطوات إدخال بياناتك ودفع الرسوم ورفع الإيصال تكتمل في المرحلة التالية.
      </p>
    </div>
  )
}
