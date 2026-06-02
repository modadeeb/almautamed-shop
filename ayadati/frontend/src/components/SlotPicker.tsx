import { useState } from 'react'
import { useDoctorSlots } from '@/features/schedule/hooks'
import type { Slot } from '@/features/schedule/types'
import { Skeleton } from '@/components/Skeleton'

interface Props {
  doctorId: number | string
  selected?: string | null
  onSelect?: (slot: Slot) => void
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function maxDateString(): string {
  const d = new Date()
  d.setDate(d.getDate() + 59)
  return d.toISOString().slice(0, 10)
}

/** اختيار التاريخ وعرض الفترات المتاحة لحجز موعد. */
export function SlotPicker({ doctorId, selected, onSelect }: Props) {
  const [date, setDate] = useState(todayString())
  const { data, isPending, isError } = useDoctorSlots(doctorId, date)

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="slot-date" className="mb-1 block text-sm font-medium">
          اختر اليوم
        </label>
        <input
          id="slot-date"
          type="date"
          value={date}
          min={todayString()}
          max={maxDateString()}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border border-line px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {isError && (
        <p className="text-sm text-danger">تعذّر تحميل المواعيد المتاحة.</p>
      )}

      {isPending ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : data && data.slots.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {data.slots.map((slot) => {
            const isSelected = selected === slot.starts_at
            return (
              <button
                key={slot.starts_at}
                type="button"
                onClick={() => onSelect?.(slot)}
                className={`rounded border px-2 py-2 text-sm transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-line bg-surface-card text-ink hover:border-primary'
                }`}
              >
                {slot.time}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-ink-muted">
          لا توجد مواعيد متاحة في هذا اليوم.
        </p>
      )}
    </div>
  )
}
