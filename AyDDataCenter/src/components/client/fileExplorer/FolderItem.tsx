// FolderItem.tsx
import React, { useState } from 'react'
import { FaFolder, FaEllipsisV } from 'react-icons/fa'
import { deleteFolder, updateFolder } from '../../../services/fileService'
import useAppContext  from '../../../hooks/useAppContext'


interface Carpeta {
  id_carpeta: number
  nombre: string
  padre: number | null
}

interface FolderItemProps {
  folder: Carpeta
  onNavigate: (folderId: number | null) => void
  refreshFolders: () => void
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onNavigate, refreshFolders }) => {
  const [showMenu, setShowMenu] = useState(false)
  const { addNotification } = useAppContext()

  const handleOpenFolder = () => {
    onNavigate(folder.id_carpeta)
  }

  const handleRenameFolder = async () => {
    const nuevoNombre = prompt('Ingrese el nuevo nombre de la carpeta:', folder.nombre)
    if (nuevoNombre && nuevoNombre !== folder.nombre) {
      try {
        await updateFolder(folder.id_carpeta, { nombre_carpeta: nuevoNombre })
        refreshFolders()
      } catch (err: unknown) {
        console.error('Error al renombrar la carpeta:', err)
        addNotification({
          type: 'error',
          message: 'Error al renombrar la carpeta. Por favor, inténtelo de nuevo.',
        })
      }
    }
  }

  const handleDeleteFolder = async () => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar esta carpeta?')
    if (confirmDelete) {
      try {
        await deleteFolder(folder.id_carpeta)
        refreshFolders()
      } catch (err: unknown) {
        console.error('Error al eliminar la carpeta:', err)
        addNotification({
          type: 'error',
          message: 'Error al eliminar la carpeta. Por favor, inténtelo de nuevo.',
        })
      }
    }
  }

  return (
    <div className="border rounded p-4 bg-white shadow hover:shadow-lg transition relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={handleOpenFolder}>
          <FaFolder className="text-yellow-500 mr-2" size={24} />
          <span className="font-semibold">{folder.nombre}</span>
        </div>
        <div className="relative">
          <button
            className="text-gray-500 focus:outline-none"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaEllipsisV />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleRenameFolder}
              >
                Renombrar
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={handleDeleteFolder}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FolderItem
