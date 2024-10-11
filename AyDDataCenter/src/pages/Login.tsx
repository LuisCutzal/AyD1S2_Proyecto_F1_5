
import LoginForm from '../components/auth/LoginForm'

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-800">
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
