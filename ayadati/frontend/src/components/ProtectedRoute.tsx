import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import type { UserRole } from '@/features/auth/types'
import { PageSkeleton } from '@/components/Skeleton'

interface Props {
  children: ReactNode
  roles?: UserRole[]
}

/** يحمي المسارات: يتطلّب تسجيل الدخول، ويتحقّق من الدور اختيارياً. */
export function ProtectedRoute({ children, roles }: Props) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <PageSkeleton />
  }

  if (status === 'guest' || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <div className="text-5xl">🚫</div>
        <h1 className="mt-3 text-xl text-danger">غير مصرّح</h1>
        <p className="mt-2 text-ink-muted">
          ليس لديك صلاحية للوصول إلى هذه الصفحة.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
