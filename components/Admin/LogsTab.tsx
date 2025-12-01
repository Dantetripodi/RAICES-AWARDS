import { Vote, Category } from '../../types';

interface LogsTabProps {
  votes: Vote[];
  categories: Category[];
}

export default function LogsTab({ votes, categories }: LogsTabProps) {
  const getNomineeName = (catId: string, nomId: string) => {
    const cat = categories.find(c => c.id === catId);
    const nom = cat?.nominees.find(n => n.id === nomId);
    return nom ? nom.name : 'Desconocido';
  };

  const getCategoryTitle = (catId: string) => {
    return categories.find(c => c.id === catId)?.title || 'Categoría Desconocida';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      {votes.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No hay votos registrados aún.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                <th className="p-4">Hora</th>
                <th className="p-4">Alumno (Votante)</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Voto a (Nominado)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {votes.sort((a, b) => b.timestamp - a.timestamp).map((vote, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(vote.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-4 font-bold text-fun-purple">
                    {vote.studentName}
                  </td>
                  <td className="p-4 text-gray-700">
                    {getCategoryTitle(vote.categoryId)}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {getNomineeName(vote.categoryId, vote.nomineeId)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}