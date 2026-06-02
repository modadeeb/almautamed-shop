const TOKEN_KEY = 'ayadati.token'

/** تخزين رمز الوصول محلياً مع حارس لبيئات بلا localStorage. */
export const authStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* تجاهل */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* تجاهل */
    }
  },
}
