import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import useAppContext from '../../hooks/useAppContext'


const LoginForm: React.FC = () => {
  const [identificador, setIdentificador] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { addNotification } = useAppContext()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ identificador, contrasena })
      addNotification({
        type: 'success',
        message: 'Bienvenido de vuelta.',
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        addNotification({
          type: 'error',
          message: err.message || 'Error al iniciar sesión.',
        })
        setError(err.message || 'Error al iniciar sesión.')
      } else {
        addNotification({
          type: 'error',
          message: 'Error al iniciar sesión.',
        })
        setError('Error al iniciar sesión.')
      }
    }
  }

  useEffect(() => {
    if (user) {
      if (user.id_rol === 1) { // Supongamos 1 es admin
        navigate('/')
      } else {
        navigate('/')
      }
    }
  }, [user, navigate])

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-10 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Iniciar Sesión</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="mb-5">
        <label className="block text-gray-700 mb-2" htmlFor="identificador">Email o Nombre de Usuario</label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
          {/* Icono de usuario */}
          <svg
            className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.794.563 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            id="identificador"
            type="text"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            required
            className="flex-1 bg-gray-50 focus:outline-none py-2 text-gray-700 placeholder-gray-400"
            placeholder="Nombre de usuario"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="contrasena">Contraseña</label>
        <div className="flex items-center border border-gray-300 rounded-md px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
          {/* Icono de contraseña */}
          <svg
            className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2 .896 2 2v3m-4-5v-2a4 4 0 118 0v2m-8 0h8m-8 0a4 4 0 00-4 4v3a4 4 0 004 4h8a4 4 0 004-4v-3a4 4 0 00-4-4h-8z" />
          </svg>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            className="flex-1 bg-gray-50 focus:outline-none py-2 text-gray-700 placeholder-gray-400"
            placeholder="Contraseña"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Iniciar Sesión
      </button>
      <div className="mt-4 text-center">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <div className="mt-4 text-center">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Registrarse
        </Link>
      </div>
    </form>

  )
}
export default LoginForm
