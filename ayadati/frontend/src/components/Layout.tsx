import { Suspense } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { OfflineBanner } from '@/components/OfflineBanner'
import { PageSkeleton } from '@/components/Skeleton'
import { useAuth } from '@/features/auth/useAuth'

/** الهيكل العام للتطبيق: ترويسة RTL + منطقة محتوى مع Suspense للتحميل الكسول. */
export function Layout() {
  const { user, status, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <header className="border-b border-line/40 bg-surface-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">عيادتي</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {status === 'authenticated' && user ? (
              <>
                <Link to="/dashboard" className="text-ink-muted hover:text-primary">
                  لوحتي
                </Link>
                <span className="text-ink-muted">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-semibold text-danger"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-ink-muted hover:text-primary">
                  دخول
                </Link>
                <Link to="/register" className="font-semibold text-primary">
                  حساب جديد
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-line/40 bg-surface-card py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} عيادتي — جميع الحقوق محفوظة
      </footer>
    </div>
  )
}
