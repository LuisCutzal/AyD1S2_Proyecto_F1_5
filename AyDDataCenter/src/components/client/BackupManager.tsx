import { useState } from 'react'

const BackupManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleCreateBackup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/backup', { method: 'POST' })
      // Lógica para manejar la respuesta
      alert('Backup creado correctamente.')
    } catch (error) {
      console.error('Error al crear el backup:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Backup de Archivos</h2>
      <p className="text-gray-600 mb-4">
        Puedes crear un backup cifrado de tus archivos para mayor seguridad.
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCreateBackup}
        disabled={loading}
      >
        {loading ? 'Creando Backup...' : 'Crear Backup'}
      </button>
    </div>
  )
}

export default BackupManager
