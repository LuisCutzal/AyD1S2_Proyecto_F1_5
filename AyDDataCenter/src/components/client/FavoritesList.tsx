import { useState, useEffect } from 'react'
import FileItem from './fileExplorer/FileItem'
import FolderItem from './fileExplorer/FolderItem'

interface FavoritesListProps {
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

const FavoritesList: React.FC<FavoritesListProps> = () => {
  const [favorites, setFavorites] = useState<FileOrFolder[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/favorites')
      const data = await response.json()
      setFavorites(data)
    } catch (error) {
      console.error('Error al cargar los favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Favoritos</h2>
      {loading ? (
        <p>Cargando favoritos...</p>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((item) =>
            item.type === 'folder' ? (
              <FolderItem key={item.id} folder={item} onNavigate={() => {}} />
            ) : (
              <FileItem key={item.id} file={item} />
            )
          )}
        </div>
      ) : (
        <p>No tienes archivos o carpetas en favoritos.</p>
      )}
    </div>
  )
}

export default FavoritesList
