import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App