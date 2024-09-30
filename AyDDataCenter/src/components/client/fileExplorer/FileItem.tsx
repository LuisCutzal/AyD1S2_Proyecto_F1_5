import { useState } from 'react'
import { FaFileAlt, FaEllipsisV } from 'react-icons/fa'
import { deleteFile, updateFile, downloadFile } from '../../../services/fileService'
import Modal from '../../shared/Modal' // Ajusta la ruta según tu estructura
import FilePreview from '../../shared/FilePreview' // Ajusta la ruta según tu estructura

interface Archivo {
  id_archivo: number
  nombre: string
  tamaño: string
  carpeta_id: number | null
  tipo: string
  url: string
}

interface FileItemProps {
  file: Archivo
  refreshFiles: () => void
}

const FileItem: React.FC<FileItemProps> = ({ file, refreshFiles }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleDownloadFile = async () => {
    try {
      const blob = await downloadFile(file.id_archivo)
      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.nombre
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err: any) {
      console.error('Error al descargar el archivo:', err)
      alert('Error al descargar el archivo. Por favor, inténtelo de nuevo.')
    }
  }

  const handleRenameFile = async () => {
    const nuevoNombre = prompt('Ingrese el nuevo nombre del archivo:', file.nombre)
    if (nuevoNombre && nuevoNombre !== file.nombre) {
      try {
        await updateFile(file.id_archivo, { nombre: nuevoNombre })
        refreshFiles()
      } catch (err: any) {
        console.error('Error al renombrar el archivo:', err)
        alert('Error al renombrar el archivo. Por favor, inténtelo de nuevo.')
      }
    }
  }

  const handleDeleteFile = async () => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar este archivo?')
    if (confirmDelete) {
      try {
        await deleteFile(file.id_archivo)
        refreshFiles()
      } catch (err: any) {
        console.error('Error al eliminar el archivo:', err)
        alert('Error al eliminar el archivo. Por favor, inténtelo de nuevo.')
      }
    }
  }

  return (
    <div className="border rounded p-4 bg-white shadow hover:shadow-lg transition relative">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        >
          <FaFileAlt className="text-blue-500 mr-2" size={24} />
          <span className="font-semibold truncate max-w-xs">{file.nombre}</span>
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
                onClick={handleDownloadFile}
              >
                Descargar
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleRenameFile}
              >
                Renombrar
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                onClick={handleDeleteFile}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        Tamaño: {file.tamaño} MB
      </div>

      {/* Modal de Vista Previa */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <FilePreview archivo={file} />
      </Modal>
    </div>
  )
}

export default FileItem
