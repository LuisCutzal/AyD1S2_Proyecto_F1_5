import { FaFileAlt, FaEllipsisV } from 'react-icons/fa'

interface FileItemProps {
  file: any
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const handleDownload = () => {
    // Lógica para descargar el archivo
  }

  return (
    <div className="border rounded p-4 bg-white shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaFileAlt className="text-blue-500 mr-2" size={24} />
          <span className="font-semibold">{file.name}</span>
        </div>
        <div className="relative">
          <button className="text-gray-500 focus:outline-none">
            <FaEllipsisV />
          </button>
          {/* Menú desplegable para acciones adicionales */}
        </div>
      </div>
      {/* Opcional: Mostrar etiquetas, tamaño, fecha de modificación */}
    </div>
  )
}

export default FileItem
