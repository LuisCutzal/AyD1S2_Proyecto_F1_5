const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Registrar un nuevo usuario (cliente).
 * @param userData - Datos del usuario a registrar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
interface UserData {
  nombre: string
  apellido: string
  nombre_usuario: string
  email: string
  celular: string
  nacionalidad: string
  pais_residencia: string
  contrasena: string
  espacio_asignado: number
}

export const registerUser = async (userData: UserData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.Error || 'Error al registrar usuario.')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }
  

  /**
   * Iniciar sesión del usuario.
   * @param credentials - Credenciales del usuario (identificador y contrasena).
   * @returns Datos del usuario autenticado.
   * @throws Error en caso de falla en la petición.
   */
  export const loginUser = async (credentials: { identificador: string, contrasena: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión.')
      }
  
      const { token } = data
  
      // Almacenar el token en localStorage para futuras peticiones
      localStorage.setItem('authToken', token)
  
      return data
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  /**
   * Obtener los datos del usuario autenticado decodificando el token jwt.
   * @returns Datos del usuario autenticado.
   * @throws Error en caso de falla en la petición.
   */

  export const getUserData = async () => {
    try {
      const token = localStorage.getItem('authToken')
  
      if (!token) {
        throw new Error('No hay token de autenticación.')
      }
  
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error('Error al obtener datos del usuario.')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en getUserData:', error)
      throw error
    }
  }