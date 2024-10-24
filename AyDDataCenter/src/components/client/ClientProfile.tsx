import { useState, useEffect } from 'react'
import { getUserData, updateProfile } from '../../services/authService'

interface UserData {
  apellido: string
  celular: string
  email: string
  id_rol: number
  id_usuario: number
  nacionalidad: string
  nombre: string
  nombre_usuario: string
  pais_residencia: string
  contrasena: string
  espacio_asignado: number
  role?: string
}

const ClientProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserData>({
    apellido: '',
    celular: '',
    email: '',
    id_rol: 3, // Asumiendo que 'Cliente' tiene id 3
    id_usuario: 0,
    nacionalidad: '',
    nombre: '',
    nombre_usuario: '',
    pais_residencia: '',
    contrasena: '',
    espacio_asignado: 15, // Valor mínimo según tu formulario
    role: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await getUserData()
      const data = {
        ...response,
        contrasena: '',
      }
      setProfileData(data)
    } catch (error) {
      console.error('Error al cargar el perfil:', error)
      setError('Error al cargar el perfil')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Convertir campos numéricos
    const numericFields = ['id_rol', 'id_usuario', 'espacio_asignado']
    const parsedValue = numericFields.includes(name) ? Number(value) : value

    setProfileData({
      ...profileData,
      [name]: parsedValue,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(profileData)
      setSuccess('Perfil actualizado correctamente.')
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      setError('Error al actualizar el perfil.')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white shadow-md rounded"
      >
        {/* ID Usuario (solo lectura) */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="id_usuario"
            value={profileData.id_usuario}
            readOnly
            className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="id_usuario"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0"
          >
            ID Usuario
          </label>
        </div>

        {/* Nombre */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="nombre"
            value={profileData.nombre}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="nombre"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nombre
          </label>
        </div>

        {/* Apellido */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="apellido"
            value={profileData.apellido}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="apellido"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Apellido
          </label>
        </div>

        {/* Nombre de Usuario */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="nombre_usuario"
            value={profileData.nombre_usuario}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="nombre_usuario"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nombre de Usuario
          </label>
        </div>

        {/* Email */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
        </div>

        {/* Celular */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="celular"
            value={profileData.celular}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="celular"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Celular
          </label>
        </div>

        {/* Nacionalidad */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="nacionalidad"
            value={profileData.nacionalidad}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="nacionalidad"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nacionalidad
          </label>
        </div>

        {/* País de Residencia */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="text"
            name="pais_residencia"
            value={profileData.pais_residencia}
            onChange={handleChange}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="pais_residencia"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            País de Residencia
          </label>
        </div>

        {/* Contraseña */}
        <div className="relative z-0 mb-6 w-full group">
          <input
            type="password"
            name="contrasena"
            value={profileData.contrasena}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="contrasena"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Contraseña
          </label>
        </div>

        {/* Espacio Asignado */}
        {/* <div className="relative z-0 mb-6 w-full group">
          <input
            type="number"
            name="espacio_asignado"
            value={profileData.espacio_asignado}
            onChange={handleChange}
            required
            min={15}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-blue-600 focus:outline-none focus:ring-0 peer"
            placeholder=" "
          />
          <label
            htmlFor="espacio_asignado"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] left-0 peer-focus:left-0 peer-focus:text-blue-600 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Espacio Asignado (GB)
          </label>
        </div> */}

        {/* Botón de Envío */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors duration-200"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}

export default ClientProfile
