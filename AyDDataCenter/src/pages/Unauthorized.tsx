import { Link } from 'react-router-dom'

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">403 - No Autorizado</h1>
      <p className="mb-4">No tienes permisos para acceder a esta página.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Volver al Inicio
      </Link>
    </div>
  )
}

export default Unauthorized