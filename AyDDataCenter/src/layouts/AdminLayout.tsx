import { Outlet } from 'react-router-dom'
import Header from '../components/shared/Header'    
import Sidebar from '../components/shared/Sidebar'
import Footer from '../components/shared/Footer'
import { FaHome, FaUsers, FaUserPlus, FaList, FaChartBar, FaBell } from 'react-icons/fa'

const AdminLayout: React.FC = () => {

  const menuItems = [
    {
      section: null,
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <FaHome />,
    },
    {
      section: 'Gestión de Usuarios',
      label: 'Crear Empleado/Cliente',
      path: '/admin/users/create',
      icon: <FaUserPlus />,
    },
    {
      section: 'Gestión de Usuarios',
      label: 'Listar Usuarios',
      path: '/admin/users/list',
      icon: <FaList />,
    },
    {
      section: 'Gestión de Usuarios',
      label: 'Usuarios Inactivos',
      path: '/admin/users/inactive',
      icon: <FaUsers />,
    },
    {
      section: 'Configuraciones de Cuenta',
      label: 'Modificar Espacio',
      path: '/admin/users/modify-space',
      icon: <FaChartBar />,
    },
    {
      section: 'Notificaciones',
      label: 'Enviar Notificaciones',
      path: '/admin/notifications',
      icon: <FaBell />,
    }
    
  ]


  return (
    <div className="flex h-screen relative">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col">
        <Header panelName='Panel de Administración'/>
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>
        <div className='absolute bottom-0 left-0 w-full z-20'> 
        <Footer  />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
