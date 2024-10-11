


const ClientSettings: React.FC = () => {
  const handleRequestSpaceChange = async (newSpace: number) => {
    // Lógica para solicitar cambio de espacio
  }

  const handleDeleteAccount = async () => {
    // Lógica para solicitar eliminación de cuenta
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Configuración</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Modificar Espacio</h3>
          <p className="text-gray-600 mb-4">
            Solicita una expansión o reducción del espacio en tu cuenta.
          </p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => handleRequestSpaceChange(200)} // Ejemplo: solicitar 200 GB
          >
            Solicitar Expansión
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">Eliminar Cuenta</h3>
          <p className="text-gray-600 mb-4">
            Esta acción es irreversible y requiere confirmación por correo electrónico.
          </p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDeleteAccount}
          >
            Solicitar Eliminación de Cuenta
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientSettings
