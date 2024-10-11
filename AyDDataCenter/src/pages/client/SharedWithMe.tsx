import Shared  from "../../components/client/Shared"
const SharedWithMe: React.FC = () => {
    return (
      <div>
        <h1>Compartidos Conmigo</h1>
        <p>Aquí encontrarás los archivos y carpetas que otros usuarios han compartido contigo.</p>
        <Shared />
      </div>
    )
  }
  
  export default SharedWithMe