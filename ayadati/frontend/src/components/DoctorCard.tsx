import { Link } from 'react-router-dom'
import { LazyImage } from '@/components/LazyImage'
import type { Doctor } from '@/features/doctors/types'

/** بطاقة طبيب في نتائج البحث. */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="card flex gap-3 transition-shadow hover:shadow-lg"
    >
      <LazyImage
        src={doctor.photo_url}
        alt={doctor.name ?? 'طبيب'}
        className="h-16 w-16 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-ink">{doctor.name}</h3>
        {doctor.specialty && (
          <span className="mt-1 inline-block rounded-full bg-tertiary-light px-2 py-0.5 text-xs text-tertiary">
            {doctor.specialty.name}
          </span>
        )}
        <p className="mt-1 truncate text-sm text-ink-muted">
          {doctor.clinic_name}
          {doctor.city ? ` — ${doctor.city}` : ''}
        </p>
      </div>
    </Link>
  )
}
