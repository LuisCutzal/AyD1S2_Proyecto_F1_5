
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-900 p-4">
      {/* SVG Inline con animación de rotación */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-64 h-64 text-white mb-8 animate-spin-slow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 015.656 0l4.242 4.242a4 4 0 010 5.656l-4.242 4.242a4 4 0 01-5.656 0l-4.242-4.242a4 4 0 010-5.656l4.242-4.242z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6" />
      </svg>

      {/* Texto Principal */}
      <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
      <p className="text-2xl text-gray-200 mb-6">¡Lo sentimos! No podemos encontrar la página que buscas.</p>

      {/* Botón de Retorno */}
      <Link
        to="/"
        className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
      >
        Volver al Inicio
      </Link>
    </div>
  )
}

export default NotFound