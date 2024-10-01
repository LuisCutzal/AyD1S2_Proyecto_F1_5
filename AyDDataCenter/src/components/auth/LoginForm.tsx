import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

const LoginForm: React.FC = () => {
  const [identificador, setIdentificador] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const data = await loginUser({ identificador, contrasena })
      login(data) // Actualiza el contexto de autenticación
      // Redirige según el rol del usuario
      if (data.user.id_rol === 1) { // Supongamos 1 es admin
        navigate('/admin')
      } else {
        navigate('/client')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al iniciar sesión.')
      } else {
        setError('Error al iniciar sesión.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Email o Nombre de Usuario</label>
        <input
          type="text"
          value={identificador}
          onChange={(e) => setIdentificador(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese su email o nombre de usuario"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700">Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese su contraseña"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Iniciar Sesión
      </button>
      <div className="mt-4 text-center">
        <a href="/reset-password" className="text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  )
}

export default LoginForm
