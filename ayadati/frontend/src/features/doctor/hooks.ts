import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Appointment } from '@/features/booking/types'

interface DoctorApptFilters {
  date?: string
  status?: string
}

export function useDoctorAppointments(filters: DoctorApptFilters) {
  return useQuery({
    queryKey: ['doctor-appointments', filters],
    queryFn: async (): Promise<Appointment[]> => {
      const res = await api.get<{ data: Appointment[] }>(
        '/api/doctor/appointments',
        { params: filters },
      )
      return res.data.data
    },
  })
}

function useApptMutation<TVars>(
  fn: (vars: TVars) => Promise<Appointment>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
    },
  })
}

export function useUpdateStatus() {
  return useApptMutation<{ id: number; status: string }>(async ({ id, status }) => {
    const res = await api.patch<{ data: Appointment }>(
      `/api/doctor/appointments/${id}/status`,
      { status },
    )
    return res.data.data
  })
}

export function useApprovePayment() {
  return useApptMutation<number>(async (id) => {
    const res = await api.post<{ data: Appointment }>(
      `/api/doctor/appointments/${id}/payment/approve`,
    )
    return res.data.data
  })
}

export function useRejectPayment() {
  return useApptMutation<{ id: number; reason: string }>(async ({ id, reason }) => {
    const res = await api.post<{ data: Appointment }>(
      `/api/doctor/appointments/${id}/payment/reject`,
      { reason },
    )
    return res.data.data
  })
}

export interface ManualBookingInput {
  starts_at: string
  patient_name: string
  patient_phone: string
  payment_method: 'cash' | 'karimi_transfer'
  amount?: number
  notes?: string
}

export function useManualBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ManualBookingInput): Promise<Appointment> => {
      const res = await api.post<{ data: Appointment }>(
        '/api/doctor/appointments/manual',
        input,
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
    },
  })
}
