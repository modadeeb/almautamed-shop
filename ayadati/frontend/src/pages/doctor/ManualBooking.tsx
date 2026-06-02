import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManualBooking } from '@/features/doctor/hooks'
import { extractApiError } from '@/lib/api'

export default function ManualBooking() {
  const navigate = useNavigate()
  const manual = useManualBooking()

  const [form, setForm] = useState({
    starts_at: '',
    patient_name: '',
    patient_phone: '',
    payment_method: 'cash' as 'cash' | 'karimi_transfer',
    amount: '',
    notes: '',
  })
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await manual.mutateAsync({
        starts_at: form.starts_at,
        patient_name: form.patient_name,
        patient_phone: form.patient_phone,
        payment_method: form.payment_method,
        amount: form.amount ? Number(form.amount) : undefined,
        notes: form.notes || undefined,
      })
      navigate('/doctor/appointments', { replace: true })
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  const inputClass =
    'w-full rounded border border-line px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl text-primary-dark">حجز يدوي</h1>
      <p className="text-sm text-ink-muted">
        لمريض حضر إلى العيادة مباشرةً. يُؤكَّد الموعد فوراً.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <p role="alert" className="rounded bg-danger/10 p-2 text-sm text-danger">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="starts_at" className="mb-1 block text-sm font-medium">
            وقت الموعد
          </label>
          <input
            id="starts_at"
            type="datetime-local"
            required
            value={form.starts_at}
            onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pname" className="mb-1 block text-sm font-medium">
            اسم المريض
          </label>
          <input
            id="pname"
            required
            value={form.patient_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, patient_name: e.target.value }))
            }
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
            value={form.patient_phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, patient_phone: e.target.value }))
            }
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="method" className="mb-1 block text-sm font-medium">
            طريقة الدفع
          </label>
          <select
            id="method"
            value={form.payment_method}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                payment_method: e.target.value as 'cash' | 'karimi_transfer',
              }))
            }
            className={inputClass}
          >
            <option value="cash">نقداً</option>
            <option value="karimi_transfer">تحويل الكريمي</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium">
            المبلغ (اختياري)
          </label>
          <input
            id="amount"
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={manual.isPending}
        >
          {manual.isPending ? 'جارٍ الحفظ…' : 'تأكيد الحجز'}
        </button>
      </form>
    </div>
  )
}
