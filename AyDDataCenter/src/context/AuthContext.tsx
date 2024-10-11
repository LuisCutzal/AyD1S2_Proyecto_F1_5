import { createContext, useState, useEffect } from 'react'
import { getUserData, loginUser } from '../services/authService'

interface User {
  id_usuario: number
  nombre_usuario: string
  id_rol: number
  email: string
}

interface AuthContextProps {
  user: User | null
  login: (credentials: { identificador: string; contrasena: string }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextProps | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const userData = await getUserData()
          setUser(userData)
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error)
          logout()
        }
      }
    }
    initializeUser()
  }, [])

  const login = async (credentials: { identificador: string; contrasena: string }) => {
    await loginUser(credentials)
    // loginUser almacena el token en localStorage
    const userData = await getUserData()
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}