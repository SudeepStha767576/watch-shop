import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '@/lib/api'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<User>
  signup: (data: Record<string, string>) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    api<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (username: string, password: string): Promise<User> => {
    const data = await api<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const signup = async (formData: Record<string, string>) => {
    await api('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  }

  const logout = () => {
    api('/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
