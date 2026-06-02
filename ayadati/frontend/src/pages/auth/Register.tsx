import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { extractApiError } from '@/lib/api'

type Role = 'patient' | 'doctor'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'patient' as Role,
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded border border-line px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-center text-2xl text-primary-dark">حساب جديد</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <p role="alert" className="rounded bg-danger/10 p-2 text-sm text-danger">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            الاسم الكامل
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            رقم الهاتف
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            required
            placeholder="مثال: 770123456"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium">
            نوع الحساب
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => update('role', e.target.value as Role)}
            className={inputClass}
          >
            <option value="patient">مريض</option>
            <option value="doctor">طبيب</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="mb-1 block text-sm font-medium"
          >
            تأكيد كلمة المرور
          </label>
          <input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            required
            value={form.password_confirmation}
            onChange={(e) => update('password_confirmation', e.target.value)}
            className={inputClass}
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'جارٍ الإنشاء…' : 'إنشاء الحساب'}
        </button>
        <p className="text-center text-sm text-ink-muted">
          لديك حساب؟{' '}
          <Link to="/login" className="font-semibold text-primary">
            سجّل الدخول
          </Link>
        </p>
      </form>
    </div>
  )
}
