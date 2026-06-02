import { createContext } from 'react'
import type { LoginPayload, RegisterPayload, User } from './types'

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
