import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDoctor } from '@/features/doctors/hooks'
import { useAuth } from '@/features/auth/useAuth'
import { LazyImage } from '@/components/LazyImage'
import { SlotPicker } from '@/components/SlotPicker'
import { PageSkeleton } from '@/components/Skeleton'
import type { Slot } from '@/features/schedule/types'

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { status } = useAuth()
  const [selected, setSelected] = useState<Slot | null>(null)
  const { data: doctor, isPending, isError } = useDoctor(id ?? '')

  function continueBooking() {
    if (!selected || !id) return
    if (status !== 'authenticated') {
      navigate('/login', { state: { from: `/doctors/${id}` } })
      return
    }
    navigate(`/doctors/${id}/book`, { state: { slot: selected } })
  }

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

      {/* المواعيد المتاحة */}
      <section className="card space-y-3">
        <h2 className="font-semibold">المواعيد المتاحة</h2>
        <SlotPicker
          doctorId={doctor.id}
          selected={selected?.starts_at ?? null}
          onSelect={setSelected}
        />
      </section>

      <button
        type="button"
        className="btn-primary w-full"
        disabled={!selected}
        onClick={continueBooking}
      >
        {selected ? `متابعة الحجز (${selected.time})` : 'اختر موعداً للمتابعة'}
      </button>
    </div>
  )
}
