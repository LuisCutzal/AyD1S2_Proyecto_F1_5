import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

/**
 * Hook personalizado para acceder al contexto de la aplicación.
 * @returns {AppContextProps} Contexto de la aplicación.
 * @throws {Error} Si se usa fuera del proveedor de contexto.
 */
const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de un AppProvider')
  }
  return context
}

export default useAppContext
