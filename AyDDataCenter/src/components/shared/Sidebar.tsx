import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Sidebar: React.FC = () => {
  const { user } = useAuth()

  const menuItems = [
    { name: 'Dashboard', path: '/client/dashboard', roles: ['client'] },
    { name: 'Archivos', path: '/client/files', roles: ['client'] },
    { name: 'Usuarios', path: '/admin/users', roles: ['admin'] },
    // Agrega más ítems según sea necesario
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role))

  return (
    <aside className="w-64 bg-gray-100">
      <nav className="p-4">
        <ul>
          {/* {filteredMenuItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link to={item.path} className="text-gray-800 hover:text-blue-600">
                {item.name}
              </Link>
            </li>
          ))} */}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
