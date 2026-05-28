import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authApi } from '../api/services'
import { encryptTripleDES } from '../utils/encryption'
import type { TokenRequest } from '../types'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (credentials: TokenRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  const login = useCallback(async (credentials: TokenRequest) => {
    // Encriptar credenciales con 3DES antes de enviar (igual que comconfig)
    const encryptedUser = await encryptTripleDES(credentials.user)
    const encryptedPassword = await encryptTripleDES(credentials.password)
    const data = await authApi.login({ user: encryptedUser, password: encryptedPassword })
    localStorage.setItem('token', data.token)
    setToken(data.token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
