import { useEffect, useState } from 'react'
import { getDashboardData } from '../../services/fileService'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import FolderTree from '../shared/FolderTree'
import {Archivo, Carpeta} from '../../types/type'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

type ClientDashboardData = {
  archivos: Archivo[]
  carpetas: Carpeta[]
  espacio_libre: string
  espacio_total: string
  espacio_usado: string
}

const ClientDashboard = () => {
  const [clientDashboardData, setClientDashboardData] = useState<ClientDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getDashboardData()
        setClientDashboardData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  if (!clientDashboardData) return null

  // Preparar datos para la gráfica de barras
  const archivoSizes = clientDashboardData.archivos.map((archivo) => parseFloat(archivo.tamaño))
  const archivoNames = clientDashboardData.archivos.map((archivo) => archivo.nombre)

  const barData = {
    labels: archivoNames,
    datasets: [
      {
        label: 'Tamaño de Archivos (MB)',
        data: archivoSizes,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  // Preparar datos para la gráfica de pastel
  const espacioUsado = parseFloat(clientDashboardData.espacio_usado)
  const espacioLibre = parseFloat(clientDashboardData.espacio_libre)

  const pieData = {
    labels: ['Espacio Usado', 'Espacio Libre'],
    datasets: [
      {
        data: [espacioUsado, espacioLibre],
        backgroundColor: ['#6366F1', '#10B981'],
        hoverBackgroundColor: ['#4F46E5', '#059669'],
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Archivos y Carpetas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de espacio con gráfica de pastel */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Espacio de Almacenamiento</h2>
          <Pie data={pieData} options={pieOptions} />
          <ul className="mt-4">
            <li>
              <strong>Espacio Total:</strong> {clientDashboardData.espacio_total} GB
            </li>
            <li>
              <strong>Espacio Usado:</strong> {clientDashboardData.espacio_usado} GB
            </li>
            <li>
              <strong>Espacio Libre:</strong> {clientDashboardData.espacio_libre} GB
            </li>
          </ul>
        </div>
        {/* Gráfica de tamaños de archivos */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Tamaños de Archivos</h2>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      {/* Lista de carpetas interactiva */}
      <div className="bg-white p-4 rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-2">Estructura de Carpetas</h2>
        <FolderTree carpetas={clientDashboardData.carpetas} archivos={clientDashboardData.archivos} />
      </div>
    </div>
  )
}

export default ClientDashboard
