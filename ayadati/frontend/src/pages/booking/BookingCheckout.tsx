import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDoctor } from '@/features/doctors/hooks'
import { useCreateBooking } from '@/features/booking/hooks'
import { useAuth } from '@/features/auth/useAuth'
import { compressImage } from '@/lib/imageCompression'
import { extractApiError } from '@/lib/api'
import { PageSkeleton } from '@/components/Skeleton'
import type { Slot } from '@/features/schedule/types'

export default function BookingCheckout() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const slot = (location.state as { slot?: Slot } | null)?.slot ?? null

  const { data: doctor, isPending } = useDoctor(id ?? '')
  const createBooking = useCreateBooking()

  const [patientName, setPatientName] = useState(user?.name ?? '')
  const [patientPhone, setPatientPhone] = useState(user?.phone ?? '')
  const [transactionRef, setTransactionRef] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isPending) return <PageSkeleton />

  if (!slot || !doctor || !id) {
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

  async function onReceiptChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setCompressing(true)
    try {
      const compressed = await compressImage(file)
      setReceipt(compressed)
      setPreview(URL.createObjectURL(compressed))
    } finally {
      setCompressing(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!receipt) {
      setError('يُرجى إرفاق صورة الإيصال.')
      return
    }
    try {
      await createBooking.mutateAsync({
        doctorId: id!,
        starts_at: slot!.starts_at,
        transaction_ref: transactionRef,
        receipt,
        patient_name: patientName,
        patient_phone: patientPhone,
      })
      navigate('/my/appointments', { replace: true })
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  const inputClass =
    'w-full rounded border border-line px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl text-primary-dark">إتمام الحجز والدفع</h1>

      {/* ملخّص الموعد */}
      <section className="card space-y-1">
        <h2 className="font-semibold">{doctor.name}</h2>
        <p className="text-sm text-ink-muted">
          {start.toLocaleDateString('ar', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          — <span className="font-semibold text-primary">{slot.time}</span>
        </p>
      </section>

      {/* الرسوم وحساب الكريمي */}
      <section className="card space-y-2 bg-primary-light">
        <h2 className="font-semibold">الدفع عبر بنك الكريمي</h2>
        <p className="text-sm">
          رسوم الكشف:{' '}
          <span className="font-bold text-primary-dark">
            {Number(doctor.consultation_fee ?? 0).toLocaleString('ar')} ريال
          </span>
        </p>
        {doctor.karimi_account_number ? (
          <div className="rounded bg-surface-card p-2 text-sm">
            <p>
              رقم الحساب:{' '}
              <span className="font-mono font-bold">
                {doctor.karimi_account_number}
              </span>
            </p>
            {doctor.karimi_account_name && (
              <p>باسم: {doctor.karimi_account_name}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-muted">
            لم يحدّد الطبيب حساب الكريمي بعد.
          </p>
        )}
        <p className="text-xs text-ink-muted">
          أودِع المبلغ ثم أرفق صورة الإيصال ورقم العملية أدناه.
        </p>
      </section>

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <p role="alert" className="rounded bg-danger/10 p-2 text-sm text-danger">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="pname" className="mb-1 block text-sm font-medium">
            اسم المريض
          </label>
          <input
            id="pname"
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pphone" className="mb-1 block text-sm font-medium">
            رقم الهاتف
          </label>
          <input
            id="pphone"
            type="tel"
            required
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="tref" className="mb-1 block text-sm font-medium">
            رقم عملية التحويل
          </label>
          <input
            id="tref"
            required
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="receipt" className="mb-1 block text-sm font-medium">
            صورة الإيصال
          </label>
          <input
            id="receipt"
            type="file"
            accept="image/*"
            required
            onChange={onReceiptChange}
            className="block w-full text-sm"
          />
          {compressing && (
            <p className="mt-1 text-xs text-ink-muted">جارٍ ضغط الصورة…</p>
          )}
          {preview && (
            <img
              src={preview}
              alt="معاينة الإيصال"
              className="mt-2 max-h-48 rounded border border-line object-contain"
            />
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={createBooking.isPending || compressing}
        >
          {createBooking.isPending ? 'جارٍ تأكيد الحجز…' : 'تأكيد الحجز'}
        </button>
      </form>
    </div>
  )
}
