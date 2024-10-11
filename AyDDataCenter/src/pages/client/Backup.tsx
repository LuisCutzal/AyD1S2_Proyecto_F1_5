import BackupManager from "../../components/client/BackupManager"

const Backup: React.FC = () => {
    return (
      <div>
        <h1>Backup de Archivos</h1>
        <p>Crea y gestiona backups cifrados de tus archivos.</p>
        <BackupManager />
      </div>
    )
  }
  
  export default Backup