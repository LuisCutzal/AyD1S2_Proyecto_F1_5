
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-gray-700">
      <div className="container mx-auto p-4 text-center">
        <p>© {new Date().getFullYear()} AYD Storage. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
