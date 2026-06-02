import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { SlotsResponse, WorkingHour } from './types'

/** أوقات عمل الطبيب الحالي (لوحة الطبيب). */
export function useWorkingHours() {
  return useQuery({
    queryKey: ['doctor', 'working-hours'],
    queryFn: async (): Promise<WorkingHour[]> => {
      const res = await api.get<{ data: WorkingHour[] }>('/api/doctor/working-hours')
      return res.data.data
    },
  })
}

/** حفظ (مزامنة) أوقات العمل بالكامل. */
export function useSyncWorkingHours() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (hours: WorkingHour[]): Promise<WorkingHour[]> => {
      const res = await api.put<{ data: WorkingHour[] }>(
        '/api/doctor/working-hours',
        { hours },
      )
      return res.data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['doctor', 'working-hours'], data)
    },
  })
}

/** الفترات المتاحة لطبيب في تاريخ محدّد. */
export function useDoctorSlots(doctorId: number | string, date: string) {
  return useQuery({
    queryKey: ['doctor', doctorId, 'slots', date],
    enabled: Boolean(date),
    queryFn: async (): Promise<SlotsResponse> => {
      const res = await api.get<SlotsResponse>(
        `/api/doctors/${doctorId}/slots`,
        { params: { date } },
      )
      return res.data
    },
  })
}
