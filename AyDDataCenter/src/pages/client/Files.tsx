import FileExplorer from '../../components/client/fileExplorer/FileExplorer'

const ClientFiles: React.FC = () => {
    return (
      <div>
        <h1>Mis Archivos</h1>
        <p>Gestiona tus archivos y carpetas aquí.</p>
        <FileExplorer />
      </div>
    )
  }
  
  export default ClientFiles