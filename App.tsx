import React, { useState, useEffect } from 'react';
import { AppState, Category, UserRole, Vote, VoteAnalysis } from './types';
import { loadState, saveState, hasStudentVoted, submitVotes, clearVotes, updateCategories, getResults, resetAll } from './services/storageService';
import { generateFunCategories, generateHighlights } from './services/geminiService';

// --- Components & Icons ---

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
);

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<UserRole>(UserRole.LANDING);
  const [appState, setAppState] = useState<AppState>(loadState());
  const [currentUser, setCurrentUser] = useState<string>('');
  
  // Refresh state from storage whenever view changes (ensures Admin sees latest votes)
  useEffect(() => {
    const freshState = loadState();
    setAppState(freshState);
  }, [view]);

  const handleLoginStudent = (name: string) => {
    if (!name.trim()) return;
    if (hasStudentVoted(name)) {
      alert('¡Ya has votado! Gracias por participar.');
      return;
    }
    setCurrentUser(name);
    setView(UserRole.STUDENT);
  };

  const handleLoginAdmin = (password: string) => {
    if (password === appState.adminPassword) {
      setView(UserRole.ADMIN);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-fun-bg text-gray-800 font-sans">
      {view === UserRole.LANDING && (
        <LandingView 
          onStudentEnter={handleLoginStudent} 
          onAdminEnter={handleLoginAdmin} 
        />
      )}

      {view === UserRole.STUDENT && (
        <StudentVotingView 
          studentName={currentUser}
          categories={appState.categories}
          onFinish={() => setView(UserRole.LANDING)}
        />
      )}

      {view === UserRole.ADMIN && (
        <AdminDashboard 
          initialState={appState}
          onLogout={() => setView(UserRole.LANDING)}
        />
      )}
    </div>
  );
}

// --- Views ---

function LandingView({ onStudentEnter, onAdminEnter }: { onStudentEnter: (n: string) => void, onAdminEnter: (p: string) => void }) {
  const [mode, setMode] = useState<'selection' | 'student' | 'admin'>('selection');
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = () => {
    if (mode === 'student') onStudentEnter(inputVal);
    if (mode === 'admin') onAdminEnter(inputVal);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-fun-purple to-fun-pink text-white">
      <h1 className="text-5xl font-bold mb-8 text-center drop-shadow-lg">🏆 Superlativos</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-gray-800">
        {mode === 'selection' && (
          <div className="space-y-4">
            <h2 className="text-2xl text-center mb-6 font-bold text-fun-purple">¿Quién eres?</h2>
            <button onClick={() => setMode('student')} className="w-full py-4 bg-fun-yellow hover:bg-yellow-400 text-white rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-md">
              🎒 Soy Alumno
            </button>
            <button onClick={() => setMode('admin')} className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl text-xl font-bold transition">
              👨‍🏫 Soy el Profe
            </button>
          </div>
        )}

        {mode !== 'selection' && (
          <div className="space-y-4">
            <button onClick={() => { setMode('selection'); setInputVal(''); }} className="text-sm text-gray-400 mb-2">← Volver</button>
            <h2 className="text-2xl font-bold text-center mb-4">
              {mode === 'student' ? '¡Entra a Votar!' : 'Acceso Admin'}
            </h2>
            <input 
              type={mode === 'admin' ? 'password' : 'text'}
              placeholder={mode === 'student' ? 'Tu Nombre y Apellido' : 'Contraseña'}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-fun-purple outline-none text-lg"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button onClick={handleSubmit} className="w-full py-4 bg-fun-purple text-white rounded-xl text-xl font-bold shadow-lg hover:bg-purple-600 transition">
              {mode === 'student' ? 'Comenzar' : 'Entrar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StudentVotingView({ studentName, categories, onFinish }: { studentName: string, categories: Category[], onFinish: () => void }) {
  const [currentCatIndex, setCurrentCatIndex] = useState(0);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isDone, setIsDone] = useState(false);

  const category = categories[currentCatIndex];

  const handleVote = (nomineeId: string) => {
    const newVote: Vote = {
      studentName,
      categoryId: category.id,
      nomineeId,
      timestamp: Date.now()
    };

    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);

    if (currentCatIndex < categories.length - 1) {
      setCurrentCatIndex(prev => prev + 1);
    } else {
      // Finish
      submitVotes(studentName, updatedVotes);
      setIsDone(true);
    }
  };

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-fun-blue text-white text-center">
        <h1 className="text-4xl font-bold mb-4">¡Votos Enviados! 🎉</h1>
        <p className="text-xl mb-8">Gracias por participar, {studentName}.</p>
        <button onClick={onFinish} className="px-8 py-3 bg-white text-fun-blue rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
          Volver al Inicio
        </button>
      </div>
    );
  }

  if (!category) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-fun-bg p-4 flex flex-col">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-fun-pink rounded-full transition-all duration-300" 
          style={{ width: `${((currentCatIndex) / categories.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">{category.emoji}</span>
          <h2 className="text-2xl font-bold text-fun-purple mb-2 uppercase tracking-wide">{category.title}</h2>
          <p className="text-gray-600 text-lg">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {category.nominees.map(nominee => (
            <button 
              key={nominee.id}
              onClick={() => handleVote(nominee.id)}
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl hover:bg-fun-yellow hover:text-white transition transform hover:-translate-y-1 border-2 border-transparent hover:border-white flex items-center space-x-4"
            >
              <span className="text-3xl">{nominee.avatar || '👤'}</span>
              <span className="text-xl font-bold">{nominee.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-gray-400 text-sm">
          Categoría {currentCatIndex + 1} de {categories.length}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ initialState, onLogout }: { initialState: AppState, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'results' | 'logs' | 'highlights' | 'settings'>('results');
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [highlights, setHighlights] = useState<VoteAnalysis | null>(null);

  // Function to force reload data from storage
  const refreshData = () => {
    const fresh = loadState();
    setState(fresh);
  };

  useEffect(() => {
    refreshData(); // Load fresh data on mount
  }, []);

  const results = React.useMemo(() => {
    // Calculate results on the fly based on current state.votes
    const res: Record<string, Record<string, number>> = {};
    state.categories.forEach(cat => {
      res[cat.id] = {};
      cat.nominees.forEach(n => res[cat.id][n.id] = 0);
    });
    state.votes.forEach(v => {
      if (res[v.categoryId] && res[v.categoryId][v.nomineeId] !== undefined) {
        res[v.categoryId][v.nomineeId]++;
      }
    });
    return res;
  }, [state.votes, state.categories]);

  const handleGenerateHighlights = async () => {
    setLoading(true);
    try {
      const analysis = await generateHighlights(state.categories, state.votes);
      setHighlights(analysis);
    } catch (e) {
      alert("Error generando highlights. Revisa la consola o la API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Seguro que quieres borrar TODOS los votos? Esto no se puede deshacer.')) {
      clearVotes();
      refreshData();
      setHighlights(null);
    }
  };

  const getNomineeName = (catId: string, nomId: string) => {
     const cat = state.categories.find(c => c.id === catId);
     const nom = cat?.nominees.find(n => n.id === nomId);
     return nom ? nom.name : 'Desconocido';
  }

  const getCategoryTitle = (catId: string) => {
      return state.categories.find(c => c.id === catId)?.title || 'Categoría Desconocida';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col hidden md:flex">
        <h2 className="text-2xl font-bold text-fun-purple mb-8">Admin Panel</h2>
        <nav className="space-y-2 flex-1">
          <SidebarBtn active={activeTab === 'results'} onClick={() => setActiveTab('results')} label="Resultados" icon="📊" />
          <SidebarBtn active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Auditoría / Logs" icon="📋" />
          <SidebarBtn active={activeTab === 'highlights'} onClick={() => setActiveTab('highlights')} label="Momentos IA" icon="✨" />
          <SidebarBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Configuración" icon="⚙️" />
        </nav>
        <button onClick={onLogout} className="text-gray-500 hover:text-red-500 text-left px-4 py-2">Cerrar Sesión</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-gray-800">
             {activeTab === 'results' && 'Resultados en Vivo'}
             {activeTab === 'logs' && 'Registro de Votos'}
             {activeTab === 'highlights' && 'Mejores Momentos (IA)'}
             {activeTab === 'settings' && 'Configuración'}
           </h1>
           <div className="flex gap-2">
             <button onClick={refreshData} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold flex items-center gap-2">
               🔄 Refrescar Datos
             </button>
             <button onClick={() => window.location.reload()} className="md:hidden bg-gray-200 px-3 py-1 rounded">Menu</button>
           </div>
        </div>

        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.categories.map(cat => (
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
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                {state.votes.length === 0 ? (
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
                                {state.votes.sort((a,b) => b.timestamp - a.timestamp).map((vote, idx) => (
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
        )}

        {/* HIGHLIGHTS TAB */}
        {activeTab === 'highlights' && (
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
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
             <h3 className="font-bold text-lg mb-4 text-red-600">Zona de Peligro</h3>
             <p className="text-gray-600 mb-4">Si reinicias los votos, se perderá todo el progreso actual de los alumnos.</p>
             <button onClick={handleReset} className="border-2 border-red-100 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-bold transition">
               🗑️ Borrar todos los votos y empezar de cero
             </button>
          </div>
        )}

      </div>
    </div>
  );
}

const SidebarBtn = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) => (
  <button 
    onClick={onClick} 
    className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${active ? 'bg-fun-bg text-fun-purple' : 'text-gray-500 hover:bg-gray-50'}`}
  >
    <span>{icon}</span>
    {label}
  </button>
);
