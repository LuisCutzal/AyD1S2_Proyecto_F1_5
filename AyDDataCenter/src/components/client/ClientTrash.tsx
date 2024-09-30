import { useState, useEffect } from 'react'

const ClientTrash: React.FC = () => {
  const [trashItems, setTrashItems] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchTrashItems()
  }, [])

  const fetchTrashItems = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/trash')
      const data = await response.json()
      setTrashItems(data)
    } catch (error) {
      console.error('Error al cargar la papelera:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (itemId: string) => {
    // Implementa la lógica para restaurar el elemento
  }

  const handleDeletePermanently = async (itemId: string) => {
    // Implementa la lógica para eliminar permanentemente el elemento
  }

  const handleEmptyTrash = async () => {
    // Implementa la lógica para vaciar la papelera
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
      ) : trashItems.length > 0 ? (
        <ul>
          {trashItems.map((item) => (
            <li key={item.id} className="border-b py-2 flex justify-between items-center">
              <div>
                {item.type === 'folder' ? '📁' : '📄'} {item.name}
              </div>
              <div>
                <button
                  className="text-green-500 mr-4"
                  onClick={() => handleRestore(item.id)}
                >
                  Restaurar
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeletePermanently(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>La papelera está vacía.</p>
      )}
    </div>
  )
}

export default ClientTrash