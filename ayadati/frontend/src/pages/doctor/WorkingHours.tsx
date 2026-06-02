import { useState } from 'react'
import { useSyncWorkingHours, useWorkingHours } from '@/features/schedule/hooks'
import { WEEK_DAYS, type WorkingHour } from '@/features/schedule/types'
import { extractApiError } from '@/lib/api'
import { PageSkeleton } from '@/components/Skeleton'

function emptyBlock(): WorkingHour {
  return {
    day_of_week: 6,
    start_time: '09:00',
    end_time: '12:00',
    slot_duration: 30,
    is_active: true,
  }
}

const inputClass =
  'rounded border border-line px-2 py-1.5 text-sm focus:border-primary focus:outline-none'

/** المحرّر الفعلي — يُهيّأ بحالة أوّلية من الخادم (بلا effect لنسخ البيانات). */
function Editor({ initial }: { initial: WorkingHour[] }) {
  const sync = useSyncWorkingHours()
  const [blocks, setBlocks] = useState<WorkingHour[]>(initial)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function updateBlock(index: number, patch: Partial<WorkingHour>) {
    setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)))
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  async function save() {
    setMessage(null)
    setError(null)
    try {
      await sync.mutateAsync(blocks)
      setMessage('تم حفظ أوقات العمل بنجاح.')
    } catch (err) {
      setError(extractApiError(err))
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl text-primary-dark">أوقات العمل</h1>
      <p className="text-sm text-ink-muted">
        حدّد أيام وساعات عملك ومدّة الكشف، وتُولَّد المواعيد تلقائياً للمرضى.
      </p>

      {message && (
        <p className="rounded bg-secondary-light p-2 text-sm text-secondary">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded bg-danger/10 p-2 text-sm text-danger">{error}</p>
      )}

      <div className="space-y-3">
        {blocks.length === 0 && (
          <p className="text-sm text-ink-muted">لا توجد أوقات عمل بعد.</p>
        )}
        {blocks.map((block, i) => (
          <div key={i} className="card flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-ink-muted">
              اليوم
              <select
                value={block.day_of_week}
                onChange={(e) =>
                  updateBlock(i, { day_of_week: Number(e.target.value) })
                }
                className={inputClass}
              >
                {WEEK_DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-muted">
              من
              <input
                type="time"
                value={block.start_time}
                onChange={(e) => updateBlock(i, { start_time: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-muted">
              إلى
              <input
                type="time"
                value={block.end_time}
                onChange={(e) => updateBlock(i, { end_time: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-muted">
              مدة الكشف (دقيقة)
              <input
                type="number"
                min={5}
                max={240}
                value={block.slot_duration}
                onChange={(e) =>
                  updateBlock(i, { slot_duration: Number(e.target.value) })
                }
                className={`${inputClass} w-24`}
              />
            </label>
            <button
              type="button"
              onClick={() => removeBlock(i)}
              className="mr-auto text-sm font-semibold text-danger"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setBlocks((prev) => [...prev, emptyBlock()])}
          className="rounded border border-primary px-4 py-2 text-sm font-semibold text-primary"
        >
          + إضافة فترة
        </button>
        <button
          type="button"
          onClick={save}
          className="btn-primary"
          disabled={sync.isPending}
        >
          {sync.isPending ? 'جارٍ الحفظ…' : 'حفظ'}
        </button>
      </div>
    </div>
  )
}

export default function WorkingHours() {
  const { data, isPending } = useWorkingHours()

  if (isPending || !data) return <PageSkeleton />

  // مفتاح يعيد تهيئة المحرّر إذا تغيّرت البيانات من الخادم.
  return <Editor key={data.map((b) => b.id).join('-')} initial={data} />
}
