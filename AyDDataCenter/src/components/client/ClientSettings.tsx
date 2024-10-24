import { useState } from "react"
import { requestSpace, deleteAccount } from "../../services/authService"
import useAppContext from '../../hooks/useAppContext'


const ClientSettings: React.FC = () => {
  // Estados para la solicitud de espacio
  const [spaceAmount, setSpaceAmount] = useState<number>(15)
  const [requestType, setRequestType] = useState<'expansion' | 'reduction'>('expansion')
  const [spaceLoading, setSpaceLoading] = useState<boolean>(false)
  const [spaceSuccess, setSpaceSuccess] = useState<string | null>(null)
  const [spaceError, setSpaceError] = useState<string | null>(null)
  const { addNotification } = useAppContext()


  // Estados para la eliminación de cuenta
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleRequestSpaceChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setSpaceLoading(true)
    setSpaceSuccess(null)
    setSpaceError(null)

    try {
      await requestSpace({ tipo_solicitud: requestType, cantidad: spaceAmount })
      setSpaceSuccess("Solicitud de " + (requestType === 'expansion' ? "expansión" : "reducción") + " enviada exitosamente.")
      addNotification({
        type: 'success',
        message: "Solicitud de " + (requestType === 'expansion' ? "expansión" : "reducción") + " enviada exitosamente.",
      })
    } catch (error: any) {
      setSpaceError(error.message || 'Error al solicitar espacio.')
      console.error('Error al solicitar espacio:', error)
      addNotification({ type: 'error', message: 'Error al solicitar espacio.' })
    } finally {
      setSpaceLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.")
    if (!confirmDelete) return

    setDeleteLoading(true)
    setDeleteSuccess(null)
    setDeleteError(null)

    try {
      await deleteAccount()
      setDeleteSuccess("Solicitud de eliminación de cuenta enviada. Revisa tu correo electrónico para confirmar.")
      addNotification({
        type: 'success',
        message: 'Solicitud de eliminación de cuenta enviada. Revisa tu correo electrónico para confirmar.',
      })
    } catch (error: any) {
      setDeleteError(error.message || 'Error al eliminar la cuenta.')
      console.error('Error al eliminar la cuenta:', error)
      addNotification({ type: 'error', message: 'Error al eliminar la cuenta.' })
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Configuración</h2>
      <div className="space-y-8">
        {/* Solicitud de Cambio de Espacio */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Modificar Espacio</h3>
          <p className="text-gray-600 mb-4">
            Solicita una expansión o reducción del espacio en tu cuenta.
          </p>
          <form onSubmit={handleRequestSpaceChange} className="flex flex-col space-y-4">
            {/* Tipo de Solicitud */}
            <div>
              <label htmlFor="requestType" className="block text-sm font-medium text-gray-700">
                Tipo de Solicitud
              </label>
              <select
                id="requestType"
                name="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as 'expansion' | 'reduction')}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="expandir">Expansión</option>
                <option value="reducir">Reducción</option>
              </select>
            </div>

            {/* Cantidad de Espacio */}
            <div>
              <label htmlFor="space" className="block text-sm font-medium text-gray-700">
                Cantidad de Espacio (GB)
              </label>
              <select
                id="space"
                name="space"
                value={spaceAmount}
                onChange={(e) => setSpaceAmount(Number(e.target.value))}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value={15}>15 GB</option>
                <option value={50}>50 GB</option>
                <option value={150}>150 GB</option>
              </select>
            </div>

            {/* Mensajes de Retroalimentación */}
            {spaceSuccess && <p className="text-green-600">{spaceSuccess}</p>}
            {spaceError && <p className="text-red-600">{spaceError}</p>}

            {/* Botón de Solicitud */}
            <button
              type="submit"
              className={`bg-green-500 text-white px-4 py-2 rounded ${
                spaceLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
              }`}
              disabled={spaceLoading}
            >
              {spaceLoading ? 'Solicitando...' : 'Solicitar Cambio de Espacio'}
            </button>
          </form>
        </div>

        {/* Eliminación de Cuenta */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Eliminar Cuenta</h3>
          <p className="text-gray-600 mb-4">
            Esta acción es irreversible y requiere confirmación por correo electrónico.
          </p>
          {deleteSuccess && <p className="text-green-600">{deleteSuccess}</p>}
          {deleteError && <p className="text-red-600">{deleteError}</p>}
          <button
            className={`bg-red-500 text-white px-4 py-2 rounded ${
              deleteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
            }`}
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Procesando...' : 'Solicitar Eliminación de Cuenta'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientSettings
