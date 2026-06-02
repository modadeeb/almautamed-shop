import { useOnlineStatus } from '@/hooks/useOnlineStatus'

/** شريط عربي واضح يظهر عند انقطاع الاتصال بدل توقّف الواجهة فجأة. */
export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div
      role="alert"
      className="bg-danger px-4 py-2 text-center text-sm font-medium text-white"
    >
      لا يوجد اتصال بالإنترنت — أنت تتصفّح وضع عدم الاتصال.
    </div>
  )
}
