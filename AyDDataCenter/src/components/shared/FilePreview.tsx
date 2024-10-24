import { useEffect, useState } from 'react'

type Archivo = {
  id_archivo: number
  nombre: string
  tamaño: string
  carpeta_id: number
  tipo: string
  url: string
}

type FilePreviewProps = {
  archivo: Archivo
}

const FilePreview = ({ archivo }: FilePreviewProps) => {
  const [txtContent, setTxtContent] = useState<string>('')

  useEffect(() => {
    if (archivo.tipo.toLowerCase() === 'txt') {
      fetch(archivo.url)
        .then((response) => response.text())
        .then((text) => setTxtContent(text))
        .catch((error) => console.error('Error al cargar el archivo TXT:', error))
    }
  }, [archivo])

  const fileType = archivo.tipo.toLowerCase()

  switch (fileType) {
    case 'pdf':
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">{archivo.nombre}</h2>
          <object data={archivo.url} type="application/pdf" width="600" height="800">
            <p>Tu navegador no soporta vista previa de PDFs.</p>
          </object>
        </div>
      )
    case 'txt':
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">{archivo.nombre}</h2>
          <pre className="bg-gray-100 p-4 rounded">{txtContent}</pre>
        </div>
      )
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">{archivo.nombre}</h2>
          <img src={archivo.url} alt={archivo.nombre} className="max-w-full max-h-full" />
        </div>
      )
    case 'mp3':
    case 'wav':
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">{archivo.nombre}</h2>
          <audio controls>
            <source src={archivo.url} type={`audio/${fileType}`} />
            Tu navegador no soporta reproducción de audio.
          </audio>
        </div>
      )
    case 'mp4':
    case 'webm':
    case 'ogg':
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">{archivo.nombre}</h2>
          <video controls className="max-w-full">
            <source src={archivo.url} type={`video/${fileType}`} />
            Tu navegador no soporta reproducción de video.
          </video>
        </div>
      )
    default:
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">{archivo.nombre}</h2>
          <p>No se puede previsualizar este tipo de archivo.</p>
        </div>
      )
  }
}

export default FilePreview
