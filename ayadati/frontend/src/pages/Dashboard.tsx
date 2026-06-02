import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import type { UserRole } from '@/features/auth/types'

const roleLabel: Record<UserRole, string> = {
  admin: 'مدير المنصّة',
  doctor: 'طبيب',
  patient: 'مريض',
}

/** لوحة عامة بعد تسجيل الدخول — تُوسَّع بمحتوى كل دور في المراحل التالية. */
export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="text-xl text-primary-dark">
          مرحباً، {user.name} 👋
        </h1>
        <p className="mt-1 text-ink-muted">
          نوع الحساب: <span className="font-semibold">{roleLabel[user.role]}</span>
        </p>
      </section>

      {user.role === 'doctor' && (
        <section className="card space-y-2">
          <h2 className="font-semibold">إدارة العيادة</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/doctor/schedule" className="btn-primary">
              أوقات العمل
            </Link>
          </div>
        </section>
      )}

      {user.role === 'patient' && (
        <section className="card space-y-2">
          <h2 className="font-semibold">حجوزاتك</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/doctors" className="btn-primary">
              ابحث عن طبيب
            </Link>
            <Link
              to="/my/appointments"
              className="rounded border border-primary px-4 py-2 text-sm font-semibold text-primary"
            >
              حجوزاتي
            </Link>
          </div>
        </section>
      )}

      <section className="card">
        <p className="text-sm text-ink-muted">
          ستظهر هنا حجوزاتك ومواعيدك وأدواتك حسب دورك في المراحل القادمة.
        </p>
      </section>
    </div>
  )
}
