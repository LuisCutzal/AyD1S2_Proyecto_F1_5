// /src/pages/Home.tsx

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-800 text-white">
        <header className="text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenido a AYD Storage</h1>
          <p className="text-xl mb-8">
            Tu solución en la nube para almacenamiento seguro y accesible desde cualquier lugar.
          </p>
        </header>

        {!user && (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-200"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 border border-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
            >
              Registrarse
            </Link>
          </div>
        )}

        {user && (
          <div className="mt-8">
            <Link
              to={user.id_rol === 1 ? '/admin' : '/client'}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-200"
            >
              Ir a mi Panel
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Home
