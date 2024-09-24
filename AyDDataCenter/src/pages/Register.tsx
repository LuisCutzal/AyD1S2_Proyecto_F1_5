import RegisterForm from '../components/auth/RegisterForm'
import Layout from '../layout/Layout'

const Register: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <RegisterForm />
      </div>
    </Layout>
  )
}

export default Register
