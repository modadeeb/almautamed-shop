export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'no_show'
  | 'cancelled'

export interface Payment {
  id: number
  amount: string
  method: string
  method_label: string
  status: 'pending' | 'approved' | 'rejected'
  status_label: string
  transaction_ref: string | null
  has_receipt: boolean
  rejection_reason: string | null
  reviewed_at: string | null
}

export interface Appointment {
  id: number
  starts_at: string
  ends_at: string
  status: AppointmentStatus
  status_label: string
  patient_name: string | null
  patient_phone: string | null
  notes: string | null
  doctor?: {
    id: number
    name: string | null
    specialty: { id: number; name: string } | null
    clinic_name: string | null
    city: string | null
  }
  payment?: Payment
}

export interface CreateBookingInput {
  doctorId: number | string
  starts_at: string
  transaction_ref: string
  receipt: File
  patient_name?: string
  patient_phone?: string
  notes?: string
}
