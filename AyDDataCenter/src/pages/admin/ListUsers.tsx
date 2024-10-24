import { useEffect, useState } from 'react'
import { getUsers, removeUserData } from '../../services/adminService'
import useAppContext from '../../hooks/useAppContext'

interface User {
  espacio_asignado: string
  espacio_ocupado: string
  id_usuario: number
  nombre_usuario: string
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const { addNotification } = useAppContext()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Error al obtener usuarios.')
      }
    }
    fetchUsers()
  }, [])


  const handlerDeleteUser = async (id: number) => {
    try {
      await removeUserData(id)
      setUsers(users.filter(user => user.id_usuario !== id))
      addNotification({
        type: 'success',
        message: 'Usuario eliminado correctamente.',
      })
    } catch (err: unknown) {
      setError(err.message || 'Error al eliminar usuario.')
      addNotification({
        type: 'error',
        message: err.message || 'Error al eliminar usuario.',
      })
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Listar Usuarios</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre de Usuario</th>
            <th className="py-2 px-4 border-b">Espacio Asignado (GB)</th>
            <th className="py-2 px-4 border-b">Espacio Ocupado (GB)</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id_usuario}>
              <td className="py-2 px-4 border-b">{user.id_usuario}</td>
              <td className="py-2 px-4 border-b">{user.nombre_usuario}</td>
              <td className="py-2 px-4 border-b">{user.espacio_asignado}</td>
              <td className="py-2 px-4 border-b">{user.espacio_ocupado}</td>
              <td className="py-2 px-4 border-b">
                {/*botones para modificar o eliminar */}
                {/* <button className="text-blue-500 hover:underline mr-2">Modificar</button> */}
                <button 
                  onClick={() => handlerDeleteUser(user.id_usuario)}
                className="text-red-500 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListUsers
