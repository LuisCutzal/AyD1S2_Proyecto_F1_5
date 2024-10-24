import { useState } from 'react'
import { registerUserAdmin } from '../../services/adminService'

const CreateUser: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nombre_usuario: '',
    email: '',
    celular: '',
    nacionalidad: '',
    pais_residencia: '',
    contrasena: '',
    id_rol: 2, // 2: Empleado, 3: Cliente
    espacio_asignado: 50,
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await registerUserAdmin({
        ...formData,
        id_rol: parseInt(formData.id_rol.toString()),
        espacio_asignado: parseInt(formData.espacio_asignado.toString()),
      })
      setSuccess('Usuario registrado correctamente.')
      setFormData({
        nombre: '',
        apellido: '',
        nombre_usuario: '',
        email: '',
        celular: '',
        nacionalidad: '',
        pais_residencia: '',
        contrasena: '',
        id_rol: 2,
        espacio_asignado: 50,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario.')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear Empleado/Cliente</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
        {/* Nombre */}
        <div className="relative mb-6">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="block w-full px-4 pt-6 pb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Nombre
          </label>
        </div>

        {/* Apellido */}
        <div className="relative mb-6">
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Apellido
          </label>
        </div>

        {/* Nombre de Usuario */}
        <div className="relative mb-6">
          <input
            type="text"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Nombre de Usuario
          </label>
        </div>

        {/* Email */}
        <div className="relative mb-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Email
          </label>
        </div>

        {/* Celular */}
        <div className="relative mb-6">
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Celular
          </label>
        </div>

        {/* Nacionalidad */}
        <div className="relative mb-6">
          <input
            type="text"
            name="nacionalidad"
            value={formData.nacionalidad}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Nacionalidad
          </label>
        </div>

        {/* País de Residencia */}
        <div className="relative mb-6">
          <input
            type="text"
            name="pais_residencia"
            value={formData.pais_residencia}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            País de Residencia
          </label>
        </div>

        {/* Contraseña */}
        <div className="relative mb-6">
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-1 text-gray-500 transition-all duration-200 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Contraseña
          </label>
        </div>

        {/* Rol */}
        <div className="relative mb-6">
          <select
            name="id_rol"
            value={formData.id_rol}
            onChange={handleChange}
            required
            className="block w-full px-4 py-4 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer appearance-none"
            placeholder=" "
          >
            <option value="" disabled hidden></option>
            <option value={2}>Empleado</option>
            <option value={3}>Cliente</option>
          </select>
          <label
            className="pointer-events-none absolute left-4 top-2 text-gray-500 transition-all duration-200 transform -translate-y-1/2 bg-white px-1 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Rol
          </label>
        </div>

        {/* Espacio Asignado */}
        <div className="relative mb-6">
          <input
            type="number"
            name="espacio_asignado"
            value={formData.espacio_asignado}
            onChange={handleChange}
            required
            min={15}
            className="block w-full px-4 py-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            className="pointer-events-none absolute left-4 top-2 text-gray-500 transition-all duration-200 transform -translate-y-1/2 bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Espacio Asignado (GB)
          </label>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-colors duration-200"
        >
          Crear Usuario
        </button>
      </form>

    </div>
  )
}

export default CreateUser