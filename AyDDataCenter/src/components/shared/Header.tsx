import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/">
          <h1 className="text-2xl font-bold">AYD Storage</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Hola, {user.nombre}</span>
              <button onClick={logout} className="bg-red-500 px-3 py-2 rounded">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="hover:underline">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header