
import LoginForm from '../components/auth/LoginForm'
import Layout from '../layout/Layout'

const Login: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginForm />
      </div>
    </Layout>
  )
}

export default Login
