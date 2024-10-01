const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import { ForgotPasswordResponse } from '../types/Auth'

import {dataLogin, dataUser} from '../utils/testDataUser'  

// Tipos necesarios
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

interface ProfileData {
  nombre: string
  email: string
  celular: number
}

/**
 * Registrar un nuevo usuario (cliente).
 * @param userData - Datos del usuario a registrar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */

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
      if (response.status === 201) {
        const data = await response.json()
        return data
      }
      if (response.status === 409) {
        throw new Error('El nombre de usuario o correo ya está en uso.')
      }
      const errorData = await response.json()
      throw new Error(errorData.Error || 'Error al registrar usuario.')
    }
    return
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
    console.log(credentials)
    //const data = dataLogin

    const { token, message } = data
    // Almacenar el token en localStorage para futuras peticiones
    localStorage.setItem('authToken', token)
    return { message }
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

export const getUserData = async () => {
  try {
    const token = localStorage.getItem('authToken')

    if (!token) {
      throw new Error('No hay token de autenticación.')
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos del usuario.')
    }

    const data = await response.json()
    //const data = dataUser
    
    if (data.id_rol === 1) {
      data.role = 'Administrador'
    } else if (data.id_rol === 2) {
      data.role = 'Empleado'
    } else {
      data.role = 'Usuario'
    }
    return data
  } catch (error) {
    console.error('Error en getUserData:', error)
    throw error
  }
}

/**
 * Cerrar sesión del usuario.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 **/

interface ForgotPasswordData {
  email: string
}

//Current this endpoint is not implemented in the backend
export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      const resData: ForgotPasswordResponse = await response.json()
      return resData
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al procesar la solicitud.')
    }
  } catch (error) {
    console.error('Error en forgotPassword:', error)
    throw error
  }
}

/**
 * Modificar el perfil del usuario.
 * @param profileData - Datos del perfil a modificar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const updateProfile = async (profileData: ProfileData) => {
  try {
    const token = localStorage.getItem('authToken')

    if (!token) {
      throw new Error('No hay token de autenticación.')
    }

    const response = await fetch(`${API_BASE_URL}/cliente/perfil/modificar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al modificar el perfil.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en updateProfile:', error)
    throw error
  }
}

/** Solicitar espacio expandir or reducir espacio asignado
 * @param spaceData - Datos de la solicitud de espacio.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 * */

export const requestSpace = async (spaceData: { tipo_solicitud: string, cantidad: number }) => {
  try {
    const token = localStorage.getItem('authToken')

    if (!token) {
      throw new Error('No hay token de autenticación.')
    }

    const response = await fetch(`${API_BASE_URL}/cliente/solicitar/espacio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(spaceData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al solicitar espacio.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en requestSpace:', error)
    throw error
  }
}

/**
 * Eliminar la cuenta del usuario.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const deleteAccount = async () => {
  try {
    const token = localStorage.getItem('authToken')

    if (!token) {
      throw new Error('No hay token de autenticación.')
    }

    const response = await fetch(`${API_BASE_URL}/cliente/eliminar`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al eliminar la cuenta.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en deleteAccount:', error)
    throw error
  }
}