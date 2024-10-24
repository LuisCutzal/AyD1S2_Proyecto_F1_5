import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRouter'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App