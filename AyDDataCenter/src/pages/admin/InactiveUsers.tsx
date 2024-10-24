import { useEffect, useState } from 'react'
import { getInactiveUsers, notifyUserRemoval, removeUserData } from '../../services/adminService'

interface InactiveUser {
  email: string
  fecha_ultimo_login: string
  id_usuario: number
  nombre_usuario: string
}

const InactiveUsers: React.FC = () => {
  const [users, setUsers] = useState<InactiveUser[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchInactiveUsers = async () => {
      try {
        const data = await getInactiveUsers()
        setUsers(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Error al obtener usuarios inactivos.')
      }
    }
    fetchInactiveUsers()
  }, [])

  const handleNotify = async (id_usuario: number) => {
    setError('')
    setMessage('')
    try {
      await notifyUserRemoval(id_usuario)
      setMessage('Correo de aviso enviado correctamente.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de aviso.')
    }
  }

  const handleRemove = async (id_usuario: number) => {
    setError('')
    setMessage('')
    try {
      await removeUserData(id_usuario)
      setUsers(users.filter(user => user.id_usuario !== id_usuario))
      setMessage('Información del usuario eliminada correctamente.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la información del usuario.')
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Usuarios Inactivos</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre de Usuario</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Último Login</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id_usuario}>
              <td className="py-2 px-4 border-b">{user.id_usuario}</td>
              <td className="py-2 px-4 border-b">{user.nombre_usuario}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.fecha_ultimo_login}</td>
              <td className="py-2 px-4 border-b">
                {/* Botones para notificar o eliminar */}
                <button
                  onClick={() => handleNotify(user.id_usuario)}
                  className="text-yellow-500 hover:underline mr-2"
                >
                  Notificar
                </button>
                <button
                  onClick={() => handleRemove(user.id_usuario)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InactiveUsers
