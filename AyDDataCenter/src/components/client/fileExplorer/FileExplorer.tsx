import { useState, useEffect } from 'react'
import FileItem from './FileItem'
import FolderItem from './FolderItem'

interface FileExplorerProps {
  // Puedes agregar props si es necesario
  
}

interface FileOrFolder {
  id: string
  name: string
  type: 'file' | 'folder'
  size: number
  createdAt: string
  updatedAt: string
  owner: string
  tags: string[]
  sharedWith: string[]
}

const FileExplorer: React.FC<FileExplorerProps> = () => {
  const [items, setItems] = useState<FileOrFolder[]>([])
  const [currentPath, setCurrentPath] = useState<string>('/')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`)
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error('Error al cargar los archivos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [currentPath])

  const handleCreateFolder = async () => {
    // Implementa la lógica para crear una carpeta
  }

  const handleUploadFile = async (file: File) => {
    // Implementa la lógica para subir un archivo
  }

  // Renderizado
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Mis Archivos</h2>
          <p className="text-sm text-gray-500">Ruta actual: {currentPath}</p>
        </div>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleCreateFolder}
          >
            Crear Carpeta
          </button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUploadFile(e.target.files[0])
              }
            }}
          />
          <label htmlFor="file-upload" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
            Subir Archivo
          </label>
        </div>
      </div>
      {loading ? (
        <p>Cargando archivos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) =>
            item.type === 'folder' ? (
              <FolderItem key={item.id} folder={item} onNavigate={setCurrentPath} />
            ) : (
              <FileItem key={item.id} file={item} />
            )
          )}
        </div>
      )}
    </div>
  )
}

export default FileExplorer
