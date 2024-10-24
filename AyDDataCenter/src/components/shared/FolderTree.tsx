import { useState } from 'react'
import { FaFolder, FaFile } from 'react-icons/fa'
import FilePreview from './FilePreview'
import Modal from '../shared/Modal'

type Archivo = {
  id_archivo: number
  nombre: string
  tamaño: string
  carpeta_id: number
  tipo: string
  url: string
}

type Carpeta = {
  id_carpeta: number
  nombre: string
  padre: number | null
}

type FolderTreeProps = {
  carpetas: Carpeta[]
  archivos: Archivo[]
}

const FolderTree = ({ carpetas, archivos }: FolderTreeProps) => {
  const [openFolders, setOpenFolders] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<Archivo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleFolderClick = (id_carpeta: number) => {
    setOpenFolders((prevOpenFolders) =>
      prevOpenFolders.includes(id_carpeta)
        ? prevOpenFolders.filter((id) => id !== id_carpeta)
        : [...prevOpenFolders, id_carpeta]
    )
  }

  const getFolderContents = (id_carpeta: number) => {
    const subcarpetas = carpetas.filter((carpeta) => carpeta.padre === id_carpeta)
    const archivosEnCarpeta = archivos.filter((archivo) => archivo.carpeta_id === id_carpeta)
    return { subcarpetas, archivos: archivosEnCarpeta }
  }

  const handleFileClick = (archivo: Archivo) => {
    setSelectedFile(archivo)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
  }

  const renderCarpetas = (carpetaPadreId: number | null = null) => {
    return carpetas
      .filter((carpeta) => carpeta.padre === carpetaPadreId)
      .map((carpeta) => {
        const isOpen = openFolders.includes(carpeta.id_carpeta)
        const {archivos } = getFolderContents(carpeta.id_carpeta)
        return (
          <div key={carpeta.id_carpeta} className="ml-4">
            <div className="flex items-center cursor-pointer" onClick={() => handleFolderClick(carpeta.id_carpeta)}>
              <FaFolder className="text-yellow-500 mr-2" />
              <span>{carpeta.nombre}</span>
              {isOpen ? (
                <span className="ml-2 text-gray-500">▼</span>
              ) : (
                <span className="ml-2 text-gray-500">►</span>
              )}
            </div>
            {isOpen && (
              <div className="ml-4">
                {renderCarpetas(carpeta.id_carpeta)}
                {archivos.map((archivo) => (
                  <div
                    key={archivo.id_archivo}
                    className="flex items-center ml-4 cursor-pointer"
                    onClick={() => handleFileClick(archivo)}
                  >
                    <FaFile className="text-blue-500 mr-2" />
                    <span>{archivo.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })
  }

  return (
    <>
      <div>{renderCarpetas()}</div>
      {selectedFile && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <FilePreview archivo={selectedFile} />
        </Modal>
      )}
    </>
  )
}

export default FolderTree
