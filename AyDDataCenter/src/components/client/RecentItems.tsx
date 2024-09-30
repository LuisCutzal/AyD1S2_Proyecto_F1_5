import { useState, useEffect } from 'react'
import FileItem from './fileExplorer/FileItem'
import FolderItem from './fileExplorer/FolderItem'

interface RecentItemsProps {
  // Puedes agregar props si es necesario
}

interface FileOrFolder {
  id: string
  name: string
  type: 'file' | 'folder'
  size: number
  createdAt: string
  updatedAt: string
  lastAccessedAt: string
  owner: string
  tags: string[]
  sharedWith: string[]
}

const RecentItems: React.FC<RecentItemsProps> = () => {
  const [recentFiles, setRecentFiles] = useState<FileOrFolder[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchRecentFiles()
  }, [])

  const fetchRecentFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/recent')
      const data = await response.json()
      setRecentFiles(data)
    } catch (error) {
      console.error('Error al cargar los archivos recientes:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Archivos Recientes</h2>
      {loading ? (
        <p>Cargando archivos recientes...</p>
      ) : recentFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentFiles.map((item) =>
            item.type === 'folder' ? (
              <FolderItem key={item.id} folder={item} onNavigate={() => {}} />
            ) : (
              <FileItem key={item.id} file={item} />
            )
          )}
        </div>
      ) : (
        <p>No has interactuado con archivos o carpetas recientemente.</p>
      )}
    </div>
  )
}

export default RecentItems
