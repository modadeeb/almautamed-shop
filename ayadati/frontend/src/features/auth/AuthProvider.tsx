import { useCallback, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { authStorage } from './authStorage'
import { AuthContext, type AuthStatus } from './authContext'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from './types'

const ME_KEY = ['auth', 'me'] as const

/** مزوّد حالة المصادقة: يجلب المستخدم الحالي ويوفّر دخول/تسجيل/خروج. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const hasToken = authStorage.get() !== null

  const { data: user, isPending } = useQuery({
    queryKey: ME_KEY,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<User | null> => {
      try {
        const res = await api.get<{ user: User }>('/api/user')
        return res.data.user
      } catch {
        authStorage.clear()
        return null
      }
    },
  })

  const login = useCallback(
    async (payload: LoginPayload): Promise<User> => {
      const res = await api.post<AuthResponse>('/api/login', payload)
      authStorage.set(res.data.token)
      queryClient.setQueryData(ME_KEY, res.data.user)
      return res.data.user
    },
    [queryClient],
  )

  const register = useCallback(
    async (payload: RegisterPayload): Promise<User> => {
      const res = await api.post<AuthResponse>('/api/register', payload)
      authStorage.set(res.data.token)
      queryClient.setQueryData(ME_KEY, res.data.user)
      return res.data.user
    },
    [queryClient],
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post('/api/logout')
    } catch {
      /* نتجاهل أخطاء الخروج من الخادم */
    }
    authStorage.clear()
    queryClient.setQueryData(ME_KEY, null)
    queryClient.clear()
  }, [queryClient])

  const status: AuthStatus = !hasToken
    ? 'guest'
    : isPending
      ? 'loading'
      : user
        ? 'authenticated'
        : 'guest'

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, status, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
