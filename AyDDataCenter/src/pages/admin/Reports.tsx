import { useEffect, useState } from 'react'
import { getUsers } from '../../services/adminService'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Reports: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState('')

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rolesCount = users.reduce((acc: any, user) => {
    acc[user.id_rol] = (acc[user.id_rol] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: ['Administrador', 'Empleado', 'Cliente'],
    datasets: [
      {
        label: '# de Usuarios',
        data: [
          rolesCount[1] || 0,
          rolesCount[2] || 0,
          rolesCount[3] || 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Usuarios por Rol',
      },
    },
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reportes y Estadísticas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-lg mx-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default Reports
