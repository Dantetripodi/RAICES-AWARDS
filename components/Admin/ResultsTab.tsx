import { Category } from '../../types';

interface ResultsTabProps {
  categories: Category[];
  results: Record<string, Record<string, number>>;
}

export default function ResultsTab({ categories, results }: ResultsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map(cat => (
        <div key={cat.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <span className="text-2xl">{cat.emoji}</span>
            <h3 className="font-bold text-lg text-gray-700">{cat.title}</h3>
          </div>
          <div className="space-y-3">
            {cat.nominees.map(nom => {
              const votes = results[cat.id]?.[nom.id] || 0;
              const totalVotes = Object.values(results[cat.id] || {}).reduce((a, b) => a + b, 0) || 1;
              const percent = Math.round((votes / totalVotes) * 100);
              return (
                <div key={nom.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{nom.name}</span>
                    <span className="text-gray-500">{votes} votos ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-fun-purple h-2.5 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}