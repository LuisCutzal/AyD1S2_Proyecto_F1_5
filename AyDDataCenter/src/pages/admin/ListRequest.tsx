import { useEffect, useState } from 'react'
import { getSpaceRequests, acceptSpaceRequest} from '../../services/adminService'
import useAppContext from '../../hooks/useAppContext'

interface ListRequests {
    id_solicitud: number,
    nombre_usuario: string,
    tipo_solicitud: string,
    cantidad: string,
    estado: string,
    fecha_solicitud: string
}

const ListRequest: React.FC = () => {
    const [requests, setRequests] = useState<ListRequests[]>([])
    const [error, setError] = useState('')
    const { addNotification } = useAppContext()

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getSpaceRequests()
                setRequests(data)
            } catch (err: any) {
                setError(err.message || 'Error al obtener las solicitudes.')
            }
        }
        fetchRequests()
    }, [])

    const handleAccept = async (id: number) => {
        try {
            await acceptSpaceRequest(id)
            setRequests(prevRequests => prevRequests.filter(request => request.id_solicitud !== id))
            addNotification({type: 'success', message: 'Solicitud aceptada exitosamente.'}) 
        } catch (err: any) {
            addNotification({type: 'error', message: err.message || 'Error al aceptar la solicitud.'})
        }
    }

    const handleReject = async (id: number) => {
        // try {
        //     await rejectSpaceRequest(id)
        //     setRequests(prevRequests => prevRequests.filter(request => request.id_solicitud !== id))
        //     addNotification({type: 'success', message: 'Solicitud rechazada exitosamente.'})
        // } catch (err: any) {
        //     addNotification({type: 'error', message: err.message || 'Error al rechazar la solicitud.'})
        // }
    }

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Lista de Solicitudes de Espacio</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID Solicitud</th>
                            <th className="py-2 px-4 border-b text-left">Nombre de Usuario</th>
                            <th className="py-2 px-4 border-b text-left">Tipo de Solicitud</th>
                            <th className="py-2 px-4 border-b text-left">Cantidad (GB)</th>
                            <th className="py-2 px-4 border-b text-left">Estado</th>
                            <th className="py-2 px-4 border-b text-left">Fecha de Solicitud</th>
                            <th className="py-2 px-4 border-b text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-4 text-center">No hay solicitudes pendientes.</td>
                            </tr>
                        ) : (
                            requests.map(request => (
                                <tr key={request.id_solicitud} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{request.id_solicitud}</td>
                                    <td className="py-2 px-4 border-b">{request.nombre_usuario}</td>
                                    <td className="py-2 px-4 border-b capitalize">{request.tipo_solicitud}</td>
                                    <td className="py-2 px-4 border-b">{request.cantidad}</td>
                                    <td className={`py-2 px-4 border-b ${request.estado === "0" ? 'text-yellow-600' : request.estado === '1' ? 'text-green-600' : 'text-red-600'}`}>
                                        {request.estado.charAt(0).toUpperCase() + request.estado.slice(1)}
                                    </td>
                                    <td className="py-2 px-4 border-b">{new Date(request.fecha_solicitud).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        {request.estado === "0" ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAccept(request.id_solicitud)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Aceptar
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request.id_solicitud)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">No disponible</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListRequest
