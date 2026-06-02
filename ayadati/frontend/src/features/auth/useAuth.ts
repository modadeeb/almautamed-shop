import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from './authContext'

/** الوصول إلى حالة المصادقة. يجب استخدامه داخل <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider')
  }
  return ctx
}
