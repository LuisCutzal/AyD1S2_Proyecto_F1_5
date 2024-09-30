import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBars } from 'react-icons/fa'
import SidebarLink from '../shared/SidebarLink'
import { useAuth } from '../../hooks/useAuth'

interface MenuItem {
  section: string | null
  label: string
  path: string
  icon: React.ReactNode
}

interface SidebarProps {
  menuItems: MenuItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredMenuItems = menuItems

  // Agrupar los elementos por sección
  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    const section = item.section || 'default'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  return (
    <>
      {/* Botón para abrir el Sidebar en pantallas pequeñas */}
      <button
        className="md:hidden p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center">
            AYD - {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </h1>
        </div>
        <nav className="mt-10">
          {Object.entries(groupedMenuItems).map(([section, items]) => (
            <div key={section}>
              {section !== 'default' && (
                <div className="mt-4 px-4 text-gray-600 font-semibold">
                  {section}
                </div>
              )}
              {items.map((item) => (
                <SidebarLink
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          ))}
          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 w-full"
            >
              <FaSignOutAlt className="mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </aside>
      {/* Overlay para cerrar el Sidebar en pantallas pequeñas */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}

export default Sidebar
