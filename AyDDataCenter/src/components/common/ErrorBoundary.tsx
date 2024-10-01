import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
}

  static getDerivedStateFromError(error: Error) {
    // Actualiza el estado para mostrar la UI de respaldo
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar el mensaje de error aquí
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <h1 className="text-4xl font-bold mb-4">Algo salió mal.</h1>
          <p className="text-gray-700">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Recargar Página
          </button>
        </div>
      )
    }

    return this.props.children 
  }
}

export default ErrorBoundary
