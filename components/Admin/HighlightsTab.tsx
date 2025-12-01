import { VoteAnalysis, Category, Vote } from '../../types';
import { generateHighlights } from '../../services/geminiService';
import Spinner from '../Shared/Spinner';

interface HighlightsTabProps {
  highlights: VoteAnalysis | null;
  setHighlights: (analysis: VoteAnalysis | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  categories: Category[];
  votes: Vote[];
}

export default function HighlightsTab({ 
  highlights, 
  setHighlights, 
  loading, 
  setLoading, 
  categories, 
  votes 
}: HighlightsTabProps) {
  const handleGenerateHighlights = async () => {
    setLoading(true);
    try {
      const analysis = await generateHighlights(categories, votes);
      setHighlights(analysis);
    } catch (e) {
      alert("Error generando highlights. Revisa la consola o la API Key.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = (catId: string) => {
    return categories.find(c => c.id === catId)?.title || 'Categoría Desconocida';
  };

  return (
    <div className="space-y-6">
      {!highlights ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="mb-4 text-gray-500">Genera un reporte narrado por IA de cómo va la votación.</p>
          <button 
            onClick={handleGenerateHighlights} 
            disabled={loading}
            className="bg-gradient-to-r from-fun-pink to-fun-purple text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            {loading ? <Spinner /> : '✨ Generar Momentos Mágicos'}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl border border-yellow-200">
            <h3 className="font-bold text-fun-yellow text-xl mb-2 flex items-center gap-2">
              🎙️ Comentario General
            </h3>
            <p className="text-gray-800 text-lg italic">"{highlights.generalCommentary}"</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {highlights.categoryHighlights.map((hl, idx) => (
              <div key={idx} className={`p-4 rounded-xl border-l-4 shadow-sm bg-white ${hl.isTightRace ? 'border-fun-pink' : 'border-fun-purple'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-600 text-sm mb-1">{getCategoryTitle(hl.categoryId)}</h4>
                    <p className="text-lg font-medium text-gray-800">{hl.highlightText}</p>
                  </div>
                  {hl.isTightRace && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                      🔥 Pelea Reñida
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleGenerateHighlights} className="mt-4 text-fun-purple underline text-sm">Regenerar Análisis</button>
        </>
      )}
    </div>
  );
}