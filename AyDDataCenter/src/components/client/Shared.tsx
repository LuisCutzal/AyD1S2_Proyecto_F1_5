import { useState, useEffect } from 'react'
import { FaFolder, FaFileAlt } from 'react-icons/fa'

const Shared: React.FC = () => {
  interface SharedItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    owner: string;
  }
  
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchSharedItems()
  }, [])

  const fetchSharedItems = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/shared')
      const data = await response.json()
      setSharedItems(data)
    } catch (error) {
      console.error('Error al cargar los archivos compartidos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Compartidos Conmigo</h2>
      {loading ? (
        <p>Cargando archivos compartidos...</p>
      ) : sharedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sharedItems.map((item) => (
            <div key={item.id} className="border rounded p-4 bg-white shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Icono según el tipo */}
                  {item.type === 'folder' ? (
                    <FaFolder className="text-yellow-500 mr-2" size={24} />
                  ) : (
                    <FaFileAlt className="text-blue-500 mr-2" size={24} />
                  )}
                  <span className="font-semibold">{item.name}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Propietario: {item.owner}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes archivos o carpetas compartidos.</p>
      )}
    </div>
  )
}

export default Shared
