const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import { ForgotPasswordResponse } from '../types/Auth'
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
      // const response = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(credentials),
      // })
  
      // const data = await response.json()
  
      // if (!response.ok) {
      //   throw new Error(data.error || 'Error en el inicio de sesión.')
      // }
      console.log(credentials)
      const data = {
        message: "Login successful",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMSwiaWRfcm9sIjoxLCJub21icmVfdXN1YXJpbyI6Im5vb29vbyJ9.0inzZBQLd5dFF41vdZwsituroIBv7ITOR2a_XAJTBe8"
        }

      const { token, message } = data
      // Almacenar el token en localStorage para futuras peticiones
      localStorage.setItem('authToken', token)
      return {message}
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
    apellido: string;
    celular: string;
    email: string;
    id_rol: number;
    id_usuario: number;
    nacionalidad: string;
    nombre: string;
    nombre_usuario: string;
    pais_residencia: string;
    role?: string;
  }

  export const getUserData = async () => {
    try {
      // const token = localStorage.getItem('authToken')
  
      // if (!token) {
      //   throw new Error('No hay token de autenticación.')
      // }
  
      // const response = await fetch(`${API_BASE_URL}/auth/me`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })
  
      // if (!response.ok) {
      //   throw new Error('Error al obtener datos del usuario.')
      // }
  
      // const data = await response.json()
      

      const data: UserData = 
      {
          "apellido": "Lopez",
          "celular": "98765432",
          "email": "maria.lopez@example.com",
          "id_rol": 3,
          "id_usuario": 12,
          "nacionalidad": "Mexico",
          "nombre": "Maria",
          "nombre_usuario": "mlopez", //username
          "pais_residencia": "Mexico",
          "contrasena": "dummyPassword",
          "espacio_asignado": 100
      }
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
    email: string;
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
      });
  
      if (response.ok) {
        const resData: ForgotPasswordResponse = await response.json();
        return resData;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la solicitud.');
      }
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      throw error;
    }
  };