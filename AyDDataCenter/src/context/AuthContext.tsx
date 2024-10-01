// /src/context/AuthContext.tsx

import React, { createContext, useState, useEffect } from 'react'
import { getUserData } from '../services/authService'

interface AuthContextProps {
  user: any
  login: (data: any) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextProps | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Al cargar, obtener el usuario si está autenticado
    const token = localStorage.getItem('authToken')
    if (token) {
      // Obtener datos del usuario
      getUserData().then(setUser).catch(logout)
    }
  }, [])

  const login = (userData: any) => {
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  )
}
