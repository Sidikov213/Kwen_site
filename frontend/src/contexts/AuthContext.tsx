import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

const AUTH_KEY = 'kwen_admin_token'

type AuthContextType = {
  token: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_KEY))

  const login = useCallback((t: string) => {
    setToken(t)
    localStorage.setItem(AUTH_KEY, t)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
