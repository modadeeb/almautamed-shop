export type UserRole = 'admin' | 'doctor' | 'patient'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  is_active: boolean
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  role?: Exclude<UserRole, 'admin'>
}

export interface LoginPayload {
  email: string
  password: string
}
