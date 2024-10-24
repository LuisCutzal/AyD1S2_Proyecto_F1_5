import ClientTrash from "../../components/client/ClientTrash"

const Trash: React.FC = () => {
    return (
      <div>
        <h1>Papelera</h1>
        <p>Archivos y carpetas eliminados. Puedes restaurarlos o vaciar la papelera.</p>
        <ClientTrash />        
      </div>
    )
  }
  
  export default Trash