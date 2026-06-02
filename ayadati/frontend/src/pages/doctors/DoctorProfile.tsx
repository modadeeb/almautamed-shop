import { Link, useParams } from 'react-router-dom'
import { useDoctor } from '@/features/doctors/hooks'
import { LazyImage } from '@/components/LazyImage'
import { PageSkeleton } from '@/components/Skeleton'

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: doctor, isPending, isError } = useDoctor(id ?? '')

  if (isPending) return <PageSkeleton />
  if (isError || !doctor) {
    return (
      <p className="py-8 text-center text-danger">تعذّر تحميل ملف الطبيب.</p>
    )
  }

  return (
    <div className="space-y-4">
      <Link to="/doctors" className="text-sm text-primary">
        → العودة للبحث
      </Link>

      <section className="card flex flex-col items-center gap-3 text-center sm:flex-row sm:text-right">
        <LazyImage
          src={doctor.photo_url}
          alt={doctor.name ?? 'طبيب'}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
        />
        <div>
          <h1 className="text-xl text-primary-dark">{doctor.name}</h1>
          {doctor.specialty && (
            <span className="mt-1 inline-block rounded-full bg-tertiary-light px-2 py-0.5 text-sm text-tertiary">
              {doctor.specialty.name}
            </span>
          )}
          {doctor.years_experience != null && (
            <p className="mt-1 text-sm text-ink-muted">
              خبرة {doctor.years_experience} سنة
            </p>
          )}
        </div>
      </section>

      <section className="card space-y-2">
        <h2 className="font-semibold">العيادة</h2>
        <p className="text-sm text-ink-muted">
          {doctor.clinic_name}
          {doctor.city ? ` — ${doctor.city}` : ''}
          {doctor.address ? `، ${doctor.address}` : ''}
        </p>
      </section>

      {doctor.bio && (
        <section className="card space-y-2">
          <h2 className="font-semibold">نبذة</h2>
          <p className="text-sm leading-7 text-ink-muted">{doctor.bio}</p>
        </section>
      )}

      {/* زر الحجز — يُفعّل في M3/M4 */}
      <button type="button" className="btn-primary w-full" disabled>
        حجز موعد (قريباً)
      </button>
    </div>
  )
}
