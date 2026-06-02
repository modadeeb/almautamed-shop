import type { AppointmentStatus } from '@/features/booking/types'

const styles: Record<AppointmentStatus, string> = {
  pending: 'bg-primary-light text-primary',
  confirmed: 'bg-secondary-light text-secondary',
  completed: 'bg-surface-muted text-ink-muted',
  no_show: 'bg-danger/10 text-danger',
  cancelled: 'bg-danger/10 text-danger',
}

export function StatusBadge({
  status,
  label,
}: {
  status: AppointmentStatus
  label: string
}) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {label}
    </span>
  )
}
