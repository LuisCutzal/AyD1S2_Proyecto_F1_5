import { useState, useEffect } from 'react'

const ClientProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    nationality: '',
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      console.error('Error al cargar el perfil:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      alert('Perfil actualizado correctamente.')
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Mi Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Resto de campos */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}

export default ClientProfile
