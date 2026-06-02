export interface Specialty {
  id: number
  name: string
  slug: string
  icon: string | null
}

export interface Doctor {
  id: number
  name: string | null
  specialty: Specialty | null
  clinic_name: string | null
  city: string | null
  address: string | null
  bio: string | null
  years_experience: number | null
  consultation_fee?: string | number | null
  karimi_account_number?: string | null
  karimi_account_name?: string | null
  photo_url: string | null
}

/** شكل استجابة الترقيم من Laravel API Resource. */
export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface DoctorFilters {
  q?: string
  specialty?: string
  city?: string
  page?: number
}
