// FileExplorer.tsx
import React, { useState, useEffect } from 'react'
import FileItem from './FileItem'
import FolderItem from './FolderItem'
import CreateFolderModal from '../../shared/CreateFolderModal' 
import { getDashboardData, createFolder, uploadFile } from '../../../services/fileService'
import { Archivo, Carpeta } from '../../../types/type'
import useAppContext  from '../../../hooks/useAppContext'

const FileExplorer: React.FC = () => {
  const [folders, setFolders] = useState<Carpeta[]>([])
  const [files, setFiles] = useState<Archivo[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState<boolean>(false)
  const { addNotification } = useAppContext()

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const data = await getDashboardData()
        setFolders(data.carpetas)
        setFiles(data.archivos)
      } catch (err: unknown) {
        console.error('Error al cargar los archivos:', err)
        setError(err.message)
        addNotification({
          type: 'error',
          message: 'Error al cargar los archivos. Por favor, inténtelo de nuevo.',
        })
        
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [addNotification])

  const handleCreateFolder = () => {
    setIsCreateFolderModalOpen(true)
  }

  const handleCreateFolderSubmit = async (nombreCarpeta: string) => {
    try {
      if (nombreCarpeta.trim() === '') {
        addNotification({
          type: 'error',
          message: 'El nombre de la carpeta no puede estar vacío.',
        })
      }
      await createFolder({
        nombre_carpeta: nombreCarpeta,
        id_carpeta_padre: currentFolderId,
      })
      // Refrescar la lista de carpetas
      const data = await getDashboardData()
      setFolders(data.carpetas)
    } catch (err: unknown) {
      console.error('Error al crear la carpeta:', err)
      addNotification({
        type: 'error',
        message: 'Error al crear la carpeta. Por favor, inténtelo de nuevo.',
      })
      setError(err.message)
    }
  }

  const handleUploadFile = async (file: File) => {
    try {
      await uploadFile(file, currentFolderId ?? undefined)
      // Refrescar la lista de archivos
      const data = await getDashboardData()
      setFiles(data.archivos)
    } catch (err: unknown) {
      console.error('Error al subir el archivo:', err)
      addNotification({
        type: 'error',
        message: 'Error al subir el archivo. Por favor, inténtelo de nuevo.',
      })
      setError(err.message)
    }
  }

  const handleNavigate = (folderId: number | null) => {
    setCurrentFolderId(folderId)
  }

  const refreshItems = async () => {
    try {
      const data = await getDashboardData()
      setFolders(data.carpetas)
      setFiles(data.archivos)
    } catch (err: unknown) {
      console.error('Error al refrescar los elementos:', err)
      addNotification({
        type: 'error',
        message: 'Error al refrescar los elementos. Por favor, inténtelo de nuevo.',
      })
      setError(err.message)
      addNotification({
        type: 'error',
        message: 'Error al cargar los archivos. Por favor, inténtelo de nuevo.',
      })
    }
  }

  // Filtrar archivos y carpetas según la carpeta actual
  const displayedFolders = folders.filter((folder) => folder.padre === currentFolderId)
  const displayedFiles = files.filter((file) => file.carpeta_id === currentFolderId)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Explorador de Archivos</h2>
          {/* Puedes agregar la ruta actual si lo deseas */}
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
          <label
            htmlFor="file-upload"
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Subir Archivo
          </label>
        </div>
      </div>
      {loading ? (
        <p>Cargando archivos...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          {/* Botón para volver a la carpeta anterior */}
          {currentFolderId !== null && (
            <button
              className="mb-4 text-blue-500"
              onClick={() =>
                handleNavigate(
                  folders.find((folder) => folder.id_carpeta === currentFolderId)?.padre ?? null
                )
              }
            >
              Volver
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedFolders.map((folder) => (
              <FolderItem
                key={folder.id_carpeta}
                folder={folder}
                onNavigate={handleNavigate}
                refreshFolders={refreshItems}
              />
            ))}
            {displayedFiles.map((file) => (
              <FileItem key={file.id_archivo} file={file} refreshFiles={refreshItems} />
            ))}
          </div>
        </div>
      )}
      {/* Modal para crear carpeta */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreate={handleCreateFolderSubmit}
      />
    </div>
  )
}

export default FileExplorer
