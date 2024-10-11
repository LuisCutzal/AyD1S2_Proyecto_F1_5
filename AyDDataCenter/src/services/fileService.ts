const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

import {dataDashboardUser} from '../utils/testDataUser'

interface FolderData {
    nombre_carpeta: string
    id_carpeta_padre?: number | null
}

interface FileData {
    nombre_archivo: string
    id_carpeta?: number
}

interface DashboardData {
    archivos: unknown[]
    carpetas: unknown[]
    espacio_libre: string
    espacio_total: string
    espacio_usado: string
}

/**
   * Obtener datos del dashboard del cliente.
   * @returns Datos del dashboard.
   * @throws Error en caso de falla en la petición.
   */
export const getDashboardData = async (): Promise<DashboardData> => {
    try {
        // const token = localStorage.getItem('authToken')

        // if (!token) {
        //     throw new Error('No hay token de autenticación.')
        // }

        // const response = await fetch(`${API_BASE_URL}/cliente/dashboard`, {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // })

        // if (!response.ok) {
        //     throw new Error('Error al obtener datos del dashboard.')
        // }

        // const data: DashboardData = await response.json()
        const data = dataDashboardUser
        return data
    } catch (error) {
        console.error('Error en getDashboardData:', error)
        throw error
    }
}

/**
 * Crear una nueva carpeta.
 * @param folderData - Datos de la carpeta a crear.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const createFolder = async (folderData: FolderData) => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/carpeta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(folderData),
        })

        if (!response.ok) {
            if (response.status === 400) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al crear la carpeta.')
            }
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en createFolder:', error)
        throw error
    }
}

/**
 * Eliminar una carpeta.
 * @param idCarpeta - ID de la carpeta a eliminar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const deleteFolder = async (idCarpeta: number) => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/carpeta/${idCarpeta}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al eliminar la carpeta.')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en deleteFolder:', error)
        throw error
    }
}

/**
 * Modificar una carpeta.
 * @param idCarpeta - ID de la carpeta a modificar.
 * @param folderData - Datos de la carpeta a modificar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const updateFolder = async (idCarpeta: number, folderData: FolderData) => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/carpeta/${idCarpeta}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(folderData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al modificar la carpeta.')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en updateFolder:', error)
        throw error
    }
}

/**
 * Subir un archivo.
 * @param file - Archivo a subir.
 * @param idCarpeta - ID de la carpeta donde se subirá el archivo (opcional).
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const uploadFile = async (file: File, idCarpeta?: number) => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const formData = new FormData()
        formData.append('archivo', file)

        if (idCarpeta !== undefined) {
            formData.append('id_carpeta', idCarpeta.toString())
        }

        const response = await fetch(`${API_BASE_URL}/cliente/archivo/subir`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al subir el archivo.')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en uploadFile:', error)
        throw error
    }
}

/**
 * Descargar un archivo.
 * @param idArchivo - ID del archivo a descargar.
 * @returns Blob del archivo.
 * @throws Error en caso de falla en la petición.
 */
export const downloadFile = async (idArchivo: number): Promise<Blob> => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/archivo/descargar/${idArchivo}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al descargar el archivo.')
        }

        const blob = await response.blob()
        return blob
    } catch (error) {
        console.error('Error en downloadFile:', error)
        throw error
    }
}

/**
 * Eliminar un archivo.
 * @param idArchivo - ID del archivo a eliminar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const deleteFile = async (idArchivo: number) => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/archivo/eliminar/${idArchivo}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al eliminar el archivo.')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en deleteFile:', error)
        throw error
    }
}

/**
 * Modificar un archivo.
 * @param idArchivo - ID del archivo a modificar.
 * @param fileData - Datos del archivo a modificar.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const updateFile = async (idArchivo: number, fileData: FileData) => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/archivo/modificar/${idArchivo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(fileData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al modificar el archivo.')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en updateFile:', error)
        throw error
    }
}

/**
 * Vaciar la papelera.
 * @returns Mensaje de éxito.
 * @throws Error en caso de falla en la petición.
 */
export const emptyTrash = async () => {
    try {
        const token = localStorage.getItem('authToken')

        if (!token) {
            throw new Error('No hay token de autenticación.')
        }

        const response = await fetch(`${API_BASE_URL}/cliente/papelera/vaciar`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Error al vaciar la papelera.')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error en emptyTrash:', error)
        throw error
    }
}
