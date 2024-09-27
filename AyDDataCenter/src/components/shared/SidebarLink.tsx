import { NavLink } from 'react-router-dom'

interface SidebarLinkProps {
  to: string
  icon: React.ReactNode
  label: string
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ${
          isActive ? 'bg-gray-200' : ''
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  )
}

export default SidebarLink