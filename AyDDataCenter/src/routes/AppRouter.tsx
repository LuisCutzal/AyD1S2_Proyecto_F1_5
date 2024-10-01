import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import Register from '../pages/Register'
import AdminLayout from '../layouts/AdminLayout'
import Reports from '../pages/admin/Reports'
import CreateUser from '../pages/admin/CreateUser'
import ListUsers from '../pages/admin/ListUsers'
import InactiveUsers from '../pages/admin/InactiveUsers'
import ModifySpace from '../pages/admin/ModifySpace'
import Notifications from '../pages/admin/Notifications'
import Unauthorized from '../pages/Unauthorized'
import NotFound from '../components/shared/NotFound'
import ClientLayout from '../layouts/ClientLayout'
import Files from '../pages/client/Files'
import SharedWithMe from '../pages/client/SharedWithMe'
import Recent from '../pages/client/Recent'
import Favorites from '../pages/client/Favorites'
import Trash from '../pages/client/Trash'
import Settings from '../pages/client/Settings'
import Profile from '../pages/client/Profile'
import Backup from '../pages/client/Backup'
import ClientDashboard from '../components/client/ClientDashboard'
import ListRequest from '../pages/admin/ListRequest'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Rutas Protegidas para Admin */}
      <Route path='/admin' element={<PrivateRoute roles={[1]} children={<AdminLayout />} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Reports />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="users/list" element={<ListUsers />} />
        <Route path="users/inactive" element={<InactiveUsers />} />
        <Route path="users/modify-space" element={<ModifySpace />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="requests" element={<ListRequest />} />
        <Route path="*" element={<NotFound />} />
      </Route>


      {/* Rutas Protegidas para Empleados y Clientes */}
      <Route path='client/' element={<PrivateRoute roles={[2, 3]} children={<ClientLayout />} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path='dashboard' element={< ClientDashboard />}/>
        <Route path='files' element={<Files />} />
        <Route path='shared' element={<SharedWithMe />}/>
        <Route path='recent' element={<Recent />}/>
        <Route path='favorites' element={<Favorites />}/> 
        <Route path='trash' element={<Trash />} /> 
        <Route path='profile' element={<Profile />} />
        <Route path='settings' element={<Settings/>} />
        <Route path='backup' element={<Backup />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Ruta de No Autorizado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter