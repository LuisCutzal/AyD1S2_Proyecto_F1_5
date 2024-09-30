import { useState } from 'react'

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (nombreCarpeta: string) => void
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [nombreCarpeta, setNombreCarpeta] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombreCarpeta.trim() !== '') {
      onCreate(nombreCarpeta)
      setNombreCarpeta('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Carpeta</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            placeholder="Nombre de la carpeta"
            value={nombreCarpeta}
            onChange={(e) => setNombreCarpeta(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
              onClick={() => {
                setNombreCarpeta('')
                onClose()
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFolderModal
