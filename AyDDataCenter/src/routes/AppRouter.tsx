import { Routes, Route } from 'react-router-dom'

// import PrivateRoute from '../components/Shared/PrivateRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
// import AdminPanel from '../pages/AdminPanel'
// import ClientPanel from '../pages/ClientPanel'
// import NotFound from '../components/Shared/NotFound'
// import ResetPassword from '../pages/ResetPassword'
// import SharedWithMe from '../pages/SharedWithMe'
// import Favorites from '../pages/Favorites'
// import Recent from '../pages/Recent'

const AppRouter: React.FC = () => {

    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        {/*<Route path="/reset-password" element={<ResetPassword />} /> */}
        
        {/* Rutas protegidas */}
        {/* <PrivateRoute path="/admin" element={<AdminPanel />} roles={['admin']} />
        <PrivateRoute path="/client" element={<ClientPanel />} roles={['client']} />
        <PrivateRoute path="/shared" element={<SharedWithMe />} roles={['client']} />
        <PrivateRoute path="/favorites" element={<Favorites />} roles={['client']} />
        <PrivateRoute path="/recent" element={<Recent />} roles={['client']} /> */}
        
        {/* Ruta 404 */}
        {/* <Route element={<NotFound />} /> */}
      </Routes>
    )
  }
  
  export default AppRouter