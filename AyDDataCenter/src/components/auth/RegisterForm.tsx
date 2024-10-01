import { useState } from 'react'
import { registerUser } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nombre_usuario: '',
    email: '',
    celular: '',
    nacionalidad: '',
    pais_residencia: '',
    contrasena: '',
    espacio_asignado: 15, // Valor por defecto
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await registerUser(formData)
      alert('Usuario registrado correctamente. Por favor, revisa tu correo para confirmar la cuenta.')
      navigate('/login')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al registrar usuario.')
      } else {
        setError('Error al registrar usuario.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrarse</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ingrese su nombre"
          />
        </div>
        <div>
          <label className="block text-gray-700">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ingrese su apellido"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Nombre de Usuario</label>
        <input
          type="text"
          name="nombre_usuario"
          value={formData.nombre_usuario}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ingrese un nombre de usuario"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ingrese su email"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Celular</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ingrese su número de celular"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-700">Nacionalidad</label>
          <input
            type="text"
            name="nacionalidad"
            value={formData.nacionalidad}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ingrese su nacionalidad"
          />
        </div>
        <div>
          <label className="block text-gray-700">País de Residencia</label>
          <input
            type="text"
            name="pais_residencia"
            value={formData.pais_residencia}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ingrese su país de residencia"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Contraseña</label>
        <input
          type="password"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ingrese una contraseña segura"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Paquete de Almacenamiento</label>
        <select
          name="espacio_asignado"
          value={formData.espacio_asignado}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value={15}>Basic - 15 GB (Gratis por 3 meses)</option>
          <option value={50}>Standard - 50 GB (Gratis por 3 meses)</option>
          <option value={150}>Premium - 150 GB (Gratis por 3 meses)</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded mt-6 hover:bg-green-700 transition duration-200"
      >
        Registrarse
      </button>
    </form>
  )
}

export default RegisterForm
