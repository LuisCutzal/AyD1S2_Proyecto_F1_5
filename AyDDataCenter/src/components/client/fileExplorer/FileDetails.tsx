// FileDetails.tsx
import React from 'react'

interface Archivo {
  id_archivo: number
  nombre_archivo: string
  tamaño: number
  fecha_creacion: string
  fecha_modificacion: string
  id_carpeta: number | null
}

interface FileDetailsProps {
  file: Archivo
  onClose: () => void
}

const FileDetails: React.FC<FileDetailsProps> = ({ file, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Detalles del Archivo</h2>
        <p><strong>Nombre:</strong> {file.nombre_archivo}</p>
        <p><strong>Tamaño:</strong> {file.tamaño} bytes</p>
        <p><strong>Fecha de Creación:</strong> {file.fecha_creacion}</p>
        <p><strong>Fecha de Modificación:</strong> {file.fecha_modificacion}</p>
        {/* Agrega más detalles si es necesario */}
        <div className="mt-6 text-right">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileDetails
