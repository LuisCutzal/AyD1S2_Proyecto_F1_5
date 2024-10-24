import { useState } from 'react'
import { notifyUserRemoval } from '../../services/adminService'

const Notifications: React.FC = () => {
  const [userId, setUserId] = useState<number | ''>('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (userId === '') {
      setError('Por favor, ingrese el ID del usuario.')
      return
    }
    try {
      await notifyUserRemoval(userId as number)
      setMessage('Correo de aviso enviado correctamente.')
      setUserId('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de aviso.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enviar Notificaciones</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleNotify}>
        {/* ID de Usuario */}
        <div className="mb-4">
          <label className="block text-gray-700">ID de Usuario</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(parseInt(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Ingrese el ID del usuario"
          />
        </div>
        {/* Botón de Envío */}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition duration-200"
        >
          Enviar Notificación
        </button>
      </form>
    </div>
  )
}

export default Notifications
