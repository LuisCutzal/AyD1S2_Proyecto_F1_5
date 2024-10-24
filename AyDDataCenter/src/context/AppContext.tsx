import { createContext, useState, ReactNode } from 'react'
import NotificationModal from '../components/notifications/NotificationModal'

// Interfaces y Tipos
export interface Notification {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface AppContextProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  notification: Notification | null
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: () => void
}

// Crear el Contexto
export const AppContext = createContext<AppContextProps | undefined>(undefined)

// Proveedor del Contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado para el Tema
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Estado para Notificación
  const [notification, setNotification] = useState<Notification | null>(null)

  // Función para Alternar Tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Función para Agregar Notificación
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      id: Date.now(),
      ...notification,
    }
    setNotification(newNotification)

    // Remover la notificación después de 5 segundos
    setTimeout(() => {
      removeNotification()
    }, 5000)
  }

  // Función para Remover Notificación
  const removeNotification = () => {
    setNotification(null)
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        notification,
        addNotification,
        removeNotification,
      }}
    >
      {children}
      {notification && (
        <NotificationModal notification={notification} onClose={removeNotification} />
      )}
    </AppContext.Provider>
  )
}
