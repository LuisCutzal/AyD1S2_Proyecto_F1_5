import { FaFolder, FaEllipsisV } from 'react-icons/fa'

interface FolderItemProps {
  folder: any
  onNavigate: (path: string) => void
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onNavigate }) => {
  const handleOpenFolder = () => {
    onNavigate(folder.path)
  }

  return (
    <div className="border rounded p-4 bg-white shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={handleOpenFolder}>
          <FaFolder className="text-yellow-500 mr-2" size={24} />
          <span className="font-semibold">{folder.name}</span>
        </div>
        <div className="relative">
          <button className="text-gray-500 focus:outline-none">
            <FaEllipsisV />
          </button>
          {/* Menú desplegable para acciones adicionales */}
        </div>
      </div>
      {/* Opcional: Mostrar etiquetas, fecha de modificación, etc. */}
    </div>
  )
}

export default FolderItem
