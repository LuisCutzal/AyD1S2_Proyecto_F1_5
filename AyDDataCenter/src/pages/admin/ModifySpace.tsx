
import { useState } from 'react'
import { updateUserSpace } from '../../services/adminService'

const ModifySpace: React.FC = () => {
  const [userId, setUserId] = useState<number | ''>('')
  const [espacioAsig, setEspacioAsig] = useState<number | ''>('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (userId === '' || espacioAsig === '') {
      setError('Por favor, complete todos los campos.')
      return
    }
    try {
      const res = await updateUserSpace(userId as number, espacioAsig as number)
      setMessage(res.message)
      setUserId('')
      setEspacioAsig('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el espacio.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Modificar Espacio de Usuario</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* ID de Usuario */}
        <div className="mb-4">
          <label className="block text-gray-700">ID de Usuario</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(parseInt(e.target.value))}
            required
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el ID del usuario"
          />
        </div>
        {/* Espacio Asignado */}
        <div className="mb-4">
          <label className="block text-gray-700">Nuevo Espacio Asignado (GB)</label>
          <input
            type="number"
            value={espacioAsig}
            onChange={(e) => setEspacioAsig(parseInt(e.target.value))}
            required
            min={0}
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el nuevo espacio en GB"
          />
        </div>
        {/* Botón de Envío */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Actualizar Espacio
        </button>
      </form>
    </div>
  )
}

export default ModifySpace
