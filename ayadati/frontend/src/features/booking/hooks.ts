import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Appointment, CreateBookingInput, Payment } from './types'

interface AppointmentResponse {
  data: Appointment & { payment?: Payment }
}

/** حجوزات المريض الحالي. */
export function useMyAppointments() {
  return useQuery({
    queryKey: ['my-appointments'],
    queryFn: async (): Promise<Appointment[]> => {
      const res = await api.get<{ data: Appointment[] }>('/api/my/appointments')
      return res.data.data
    },
  })
}

/** إنشاء حجز مع رفع صورة الإيصال (multipart). */
export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateBookingInput): Promise<Appointment> => {
      const form = new FormData()
      form.append('starts_at', input.starts_at)
      form.append('transaction_ref', input.transaction_ref)
      form.append('receipt', input.receipt)
      if (input.patient_name) form.append('patient_name', input.patient_name)
      if (input.patient_phone) form.append('patient_phone', input.patient_phone)
      if (input.notes) form.append('notes', input.notes)

      const res = await api.post<AppointmentResponse>(
        `/api/doctors/${input.doctorId}/appointments`,
        form,
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
  })
}
