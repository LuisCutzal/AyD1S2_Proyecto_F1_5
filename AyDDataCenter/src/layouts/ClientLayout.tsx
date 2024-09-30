import { Outlet } from 'react-router-dom'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import Sidebar from '../components/shared/Sidebar'
import {
  FaHome,
  FaFolder,
  FaShareAlt,
  FaTrash,
  FaStar,
  FaClock,
  FaUser,
  FaCog,
  FaDatabase,
} from 'react-icons/fa'

const ClientLayout: React.FC = () => {

  //elementos del menú para el cliente
  const menuItems = [
    {
      section: null,
      label: 'Dashboard',
      path: '/client/dashboard',
      icon: <FaHome />,
    },
    {
      section: 'Archivos',
      label: 'Mis Archivos',
      path: '/client/files',
      icon: <FaFolder />,
    },
    {
      section: 'Archivos',
      label: 'Compartidos Conmigo',
      path: '/client/shared',
      icon: <FaShareAlt />,
    },
    {
      section: 'Archivos',
      label: 'Recientes',
      path: '/client/recent',
      icon: <FaClock />,
    },
    {
      section: 'Archivos',
      label: 'Favoritos',
      path: '/client/favorites',
      icon: <FaStar />,
    },
    {
      section: 'Archivos',
      label: 'Papelera',
      path: '/client/trash',
      icon: <FaTrash />,
    },
    {
      section: 'Cuenta',
      label: 'Perfil',
      path: '/client/profile',
      icon: <FaUser />,
    },
    {
      section: 'Cuenta',
      label: 'Configuración',
      path: '/client/settings',
      icon: <FaCog />,
    },
    {
      section: 'Herramientas',
      label: 'Backup de Archivos',
      path: '/client/backup',
      icon: <FaDatabase />,
    },
  ]

  return (
    <div className="flex h-screen relative">
      <Sidebar menuItems={menuItems}/>
      <div className="flex-1 flex flex-col">
        <Header panelName='Panel de Administración' />
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
        <div className='absolute bottom-0 left-0 w-full z-20'>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default ClientLayout