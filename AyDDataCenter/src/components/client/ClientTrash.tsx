import { useState, useEffect } from 'react'
import { emptyTrash, getTrash } from '../../services/fileService'
import useAppContext from '../../hooks/useAppContext'

interface TrashData {
  archivos_en_papelera: any[]
  carpetas_en_papelera: any[]
}

interface Archivo {
  id_archivo: number
  nombre: string
  tamaño: string
  carpeta_id: number
  tipo: string
  url: string
}

interface Carpeta {
  id_carpeta: number
  nombre: string
  padre: number | null
}

const ClientTrash: React.FC = () => {
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const [carpetas, setCarpetas] = useState<Carpeta[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { addNotification } = useAppContext()

  useEffect(() => {
    fetchTrashItems()
  }, [])

  const fetchTrashItems = async () => {
    setLoading(true)
    try {
      const data: TrashData = await getTrash()
      setArchivos(data.archivos_en_papelera ?? [])
      setCarpetas(data.carpetas_en_papelera ?? [])
    } catch (error) {
      console.error('Error al cargar la papelera:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleEmptyTrash = async () => {
    try {
      const response = await emptyTrash()
      addNotification({
        type: 'success',
        message: response.message
      })
      setArchivos([])
      setCarpetas([])
    } catch (error) {
      addNotification({ type: 'error', message: 'Error al vaciar la papelera.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Papelera</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleEmptyTrash}
        >
          Vaciar Papelera
        </button>
       
      </div>
      {loading ? (
        <p>Cargando papelera...</p>
      ) : archivos.length === 0 && carpetas.length === 0 ? (
        <p>La papelera está vacía.</p>
      ) : (
        <div>
          {carpetas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Carpetas</h3>
              <ul>
                {carpetas.map((carpeta) => (
                  <li key={carpeta.id_carpeta} className="border-b py-2">
                    📁 {carpeta.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {archivos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Archivos</h3>
              <ul>
                {archivos.map((archivo) => (
                  <li key={archivo.id_archivo} className="border-b py-2 flex items-center">
                    {/*agregar íconos basados en el tipo de archivo */}
                    {getFileIcon(archivo.tipo)} {archivo.nombre}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Función auxiliar para obtener íconos según el tipo de archivo
const getFileIcon = (tipo: string) => {
  switch (tipo) {
    case 'pdf':
      return '📄'
    case 'txt':
      return '📄'
    case 'jpg':
    case 'png':
      return '🖼️'
    case 'mp3':
    case 'wav':
      return '🎵'
    case 'mp4':
    case 'webm':
      return '🎬'
    case 'pptx':
      return '📊'
    default:
      return '📁'
  }
}

export default ClientTrash