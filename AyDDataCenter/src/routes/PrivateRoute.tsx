import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface PrivateRouteProps {
  children: React.ReactElement
  roles?: number[] // Roles permitidos
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Puedes reemplazar esto con un componente de carga personalizado
    return <div>Cargando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user.id_rol)) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />
  }

  return children
}

export default PrivateRoute
