const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

import {adminUsers, dataUserInactive} from '../utils/testDataUser'

// Registrar Usuario por Admin
export interface UserDataAdmin {
  nombre: string
  apellido: string
  nombre_usuario: string
  email: string
  celular: string
  nacionalidad: string
  pais_residencia: string
  contrasena: string
  id_rol: number
  espacio_asignado: number
}

export const registerUserAdmin = async (userData: UserDataAdmin) => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/registers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    if (response.status === 201) {
      const data = await response.json()
      return data
    } else if (response.status === 409) {
      const errorData = await response.json()
      throw new Error(errorData.Error || 'El nombre de usuario o correo ya existen.')
    } else {
      const errorData = await response.json()
      throw new Error(errorData.Error || 'Error al registrar usuario.')
    }
  } catch (error) {
    console.error('Error en registro por admin:', error)
    throw error
  }
}

// Obtener Lista de Usuarios
export interface User {
  espacio_asignado: string
  espacio_ocupado: string
  id_usuario: number
  nombre_usuario: string
}

export const getUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al obtener usuarios.')
    }
    //const data = adminUsers
    //return data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

// Obtener Usuarios Inactivos
export interface InactiveUser {
  email: string
  fecha_ultimo_login: string
  id_usuario: number
  nombre_usuario: string
}

export const getInactiveUsers = async (): Promise<InactiveUser[]> => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/inactive`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al obtener usuarios inactivos.')
    }
    //const data = dataUserInactive
    //return data
  } catch (error) {
    console.error('Error al obtener usuarios inactivos:', error)
    throw error
  }
}

// Actualizar Espacio Asignado de Usuario
export const updateUserSpace = async (id_usuario: number, espacio_asignado: number) => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id_usuario}/update_space`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ espacio_asignado }),
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al actualizar el espacio.')
    }
  } catch (error) {
    console.error('Error al actualizar espacio del usuario:', error)
    throw error
  }
}

// Notificar Eliminación de Usuario
export const notifyUserRemoval = async (id_usuario: number) => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id_usuario}/notify_removal`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al enviar la notificación.')
    }
  } catch (error) {
    console.error('Error al notificar eliminación de usuario:', error)
    throw error
  }
}

// Eliminar Información de Usuario
export const removeUserData = async (id_usuario: number) => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id_usuario}/remove`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al eliminar la información del usuario.')
    }
  } catch (error) {
    console.error('Error al eliminar información del usuario:', error)
    throw error
  }
}

export interface SpaceRequest {
  id_solicitud: number,
  nombre_usuario: string,
  tipo_solicitud: string,
  cantidad: string,
  estado: string,
  fecha_solicitud: string
}

// Obtener Solicitudes de Espacio
export const getSpaceRequests = async (): Promise<SpaceRequest[]> => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/solicitudes/espacio`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      console.log(data)
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al obtener solicitudes de espacio.')
    }
  } catch (error) {
    console.error('Error al obtener solicitudes de espacio:', error)
    throw error
  }
}

// Aceptar Solicitud de Espacio 
export const acceptSpaceRequest = async (id_solicitud: number) => {
  const token = localStorage.getItem('authToken')

  try {
    const response = await fetch(`${API_BASE_URL}/admin/solicitudes/espacio/aceptar/${id_solicitud}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const data = await response.json()
      return data
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al aceptar la solicitud.')
    }
  } catch (error) {
    console.error('Error al aceptar solicitud de espacio:', error)
    throw error
  }
}