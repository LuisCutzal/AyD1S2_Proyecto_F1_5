import FavoritesList from "../../components/client/FavoritesList"

const Favorites: React.FC = () => {
    return (
      <div>
        <h1>Favoritos</h1>
        <p>Tus archivos y carpetas marcados como favoritos.</p>
        <FavoritesList />
      </div>
    )
  }
  
  export default Favorites