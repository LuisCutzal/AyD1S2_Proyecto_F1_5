import RecentItems from "../../components/client/RecentItems"
const Recent: React.FC = () => {
    return (
      <div>
        <h1>Recientes</h1>
        <p>Archivos y carpetas con los que has interactuado recientemente.</p>
        <RecentItems />
      </div>
    )
  }
  
  export default Recent