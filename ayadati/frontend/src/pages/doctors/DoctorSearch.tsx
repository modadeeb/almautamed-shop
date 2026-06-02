import { useEffect, useMemo, useState } from 'react'
import { useDoctors, useSpecialties } from '@/features/doctors/hooks'
import { DoctorCard } from '@/components/DoctorCard'
import { Skeleton } from '@/components/Skeleton'

export default function DoctorSearch() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [specialty, setSpecialty] = useState<string>('')
  const [page, setPage] = useState(1)

  const { data: specialties } = useSpecialties()

  // تأخير البحث (debounce) لتقليل الطلبات على الشبكات الضعيفة.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // إعادة الصفحة للأولى عند تغيّر الفلاتر (داخل المعالجات لا داخل effect).
  function onSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function onSpecialtyChange(slug: string) {
    setSpecialty(slug)
    setPage(1)
  }

  const filters = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      specialty: specialty || undefined,
      page,
    }),
    [debouncedSearch, specialty, page],
  )

  const { data, isPending, isError, isPlaceholderData } = useDoctors(filters)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="mb-1 text-2xl text-primary-dark">ابحث عن طبيب</h1>
        <p className="text-sm text-ink-muted">
          اختر التخصّص أو ابحث بالاسم، ثم احجز موعدك.
        </p>
      </div>

      {/* البحث بالاسم */}
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="ابحث باسم الطبيب…"
        className="w-full rounded border border-line px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {/* فلتر التخصّصات */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSpecialtyChange('')}
          className={`rounded-full px-3 py-1 text-sm ${
            specialty === ''
              ? 'bg-primary text-white'
              : 'bg-surface-muted text-ink-muted'
          }`}
        >
          الكل
        </button>
        {specialties?.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSpecialtyChange(s.slug)}
            className={`rounded-full px-3 py-1 text-sm ${
              specialty === s.slug
                ? 'bg-primary text-white'
                : 'bg-surface-muted text-ink-muted'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* النتائج */}
      {isError && (
        <p className="text-danger">تعذّر تحميل الأطباء. حاول مرة أخرى.</p>
      )}

      {isPending ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <>
          {data && data.data.length === 0 && (
            <p className="py-8 text-center text-ink-muted">
              لا يوجد أطباء مطابقون لبحثك.
            </p>
          )}
          <div
            className={`grid gap-3 sm:grid-cols-2 ${
              isPlaceholderData ? 'opacity-60' : ''
            }`}
          >
            {data?.data.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {/* الترقيم */}
          {data && data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded border border-line px-3 py-1 text-sm disabled:opacity-40"
              >
                السابق
              </button>
              <span className="text-sm text-ink-muted">
                صفحة {data.meta.current_page} من {data.meta.last_page}
              </span>
              <button
                type="button"
                disabled={page >= data.meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded border border-line px-3 py-1 text-sm disabled:opacity-40"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
