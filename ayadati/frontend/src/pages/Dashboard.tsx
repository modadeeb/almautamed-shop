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

      <section className="card">
        <p className="text-sm text-ink-muted">
          هذه لوحتك المبدئية. ستظهر هنا حجوزاتك ومواعيدك وأدواتك حسب دورك في
          المراحل القادمة.
        </p>
      </section>
    </div>
  )
}
