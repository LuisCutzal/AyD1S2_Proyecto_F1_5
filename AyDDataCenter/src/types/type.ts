export type Archivo = {
    id_archivo: number
    nombre: string
    tamaño: string
    carpeta_id: number
    tipo: string
    url: string
  }
  
  export type Carpeta = {
    id_carpeta: number
    nombre: string
    padre: number | null
  }
  