/** هيكل تحميل (Skeleton) بسيط يعطي إحساساً بالسرعة أثناء جلب البيانات. */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-muted ${className}`}
      aria-hidden="true"
    />
  )
}

/** هيكل تحميل لصفحة كاملة يُستخدم كـ Suspense fallback. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4" role="status" aria-label="جارٍ التحميل">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <span className="sr-only">جارٍ التحميل…</span>
    </div>
  )
}
