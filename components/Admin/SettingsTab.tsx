import { clearVotes } from '../../services/storageService';

interface SettingsTabProps {
  onDataChange: () => void;
  setHighlights: (val: null) => void;
}

export default function SettingsTab({ onDataChange, setHighlights }: SettingsTabProps) {
  const handleReset = async () => {
    if (confirm('¿Seguro que quieres borrar TODOS los votos? Esto no se puede deshacer.')) {
      try {
        await clearVotes();
        onDataChange();
        setHighlights(null);
        alert('Votos eliminados correctamente');
      } catch (error) {
        console.error('Error al borrar votos:', error);
        alert('Error al borrar los votos');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-red-600">Zona de Peligro</h3>
      <p className="text-gray-600 mb-4">Si reinicias los votos, se perderá todo el progreso actual de los alumnos.</p>
      <button onClick={handleReset} className="border-2 border-red-100 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-bold transition">
        🗑️ Borrar todos los votos y empezar de cero
      </button>
    </div>
  );
}