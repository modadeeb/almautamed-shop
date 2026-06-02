export interface WorkingHour {
  id?: number
  day_of_week: number // 0=الأحد .. 6=السبت
  start_time: string // HH:MM
  end_time: string // HH:MM
  slot_duration: number
  is_active: boolean
}

export interface Slot {
  time: string // HH:MM
  starts_at: string // ISO
  ends_at: string // ISO
}

export interface SlotsResponse {
  date: string
  slots: Slot[]
}

export const WEEK_DAYS: { value: number; label: string }[] = [
  { value: 6, label: 'السبت' },
  { value: 0, label: 'الأحد' },
  { value: 1, label: 'الإثنين' },
  { value: 2, label: 'الثلاثاء' },
  { value: 3, label: 'الأربعاء' },
  { value: 4, label: 'الخميس' },
  { value: 5, label: 'الجمعة' },
]
