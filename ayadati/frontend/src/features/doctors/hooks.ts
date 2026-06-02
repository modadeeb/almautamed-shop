import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Doctor, DoctorFilters, Paginated, Specialty } from './types'

/** قائمة التخصّصات — بيانات مرجعية تُخزَّن طويلاً. */
export function useSpecialties() {
  return useQuery({
    queryKey: ['specialties'],
    staleTime: 60 * 60_000, // ساعة: نادراً ما تتغيّر.
    queryFn: async (): Promise<Specialty[]> => {
      const res = await api.get<{ data: Specialty[] }>('/api/specialties')
      return res.data.data
    },
  })
}

/** بحث الأطباء مع فلترة وترقيم؛ يحتفظ بالبيانات السابقة لتنقّل أنعم. */
export function useDoctors(filters: DoctorFilters) {
  return useQuery({
    queryKey: ['doctors', filters],
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<Paginated<Doctor>> => {
      const res = await api.get<Paginated<Doctor>>('/api/doctors', {
        params: filters,
      })
      return res.data
    },
  })
}

/** ملف طبيب واحد. */
export function useDoctor(id: number | string) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async (): Promise<Doctor> => {
      const res = await api.get<{ data: Doctor }>(`/api/doctors/${id}`)
      return res.data.data
    },
  })
}
