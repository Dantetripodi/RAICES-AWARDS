import { useState, useEffect, useMemo } from 'react';
import { AppState, VoteAnalysis } from '../../types';
import { loadState } from '../../services/storageService';
import SidebarBtn from './SidebarBtn';
import ResultsTab from './ResultsTab';
import LogsTab from './LogsTab';
import HighlightsTab from './HighlightsTab';
import SettingsTab from './SettingsTab';

interface AdminDashboardProps {
  initialState: AppState;
  onLogout: () => void;
}

export default function AdminDashboard({ initialState, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'results' | 'logs' | 'highlights' | 'settings'>('results');
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [highlights, setHighlights] = useState<VoteAnalysis | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const refreshData = async () => {
    const fresh = await loadState();
    setState(fresh);
  };
  
  useEffect(() => {
    refreshData();
  }, []);

  const results = useMemo(() => {
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

  const handleTabChange = (tab: 'results' | 'logs' | 'highlights' | 'settings') => {
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className={`
        fixed md:relative inset-0 z-50 md:z-0
        ${showMobileMenu ? 'block' : 'hidden'} md:block
        bg-black bg-opacity-50 md:bg-transparent
      `} onClick={() => setShowMobileMenu(false)}>
        <div 
          className="w-64 h-full bg-white border-r border-gray-200 p-6 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-fun-purple">Admin Panel</h2>
            <button 
              onClick={() => setShowMobileMenu(false)} 
              className="md:hidden text-gray-500 text-2xl"
            >
              ×
            </button>
          </div>
          
          <nav className="space-y-2 flex-1">
            <SidebarBtn 
              active={activeTab === 'results'} 
              onClick={() => handleTabChange('results')} 
              label="Resultados" 
              icon="📊" 
            />
            <SidebarBtn 
              active={activeTab === 'logs'} 
              onClick={() => handleTabChange('logs')} 
              label="Auditoría / Logs" 
              icon="📋" 
            />
            <SidebarBtn 
              active={activeTab === 'highlights'} 
              onClick={() => handleTabChange('highlights')} 
              label="Momentos IA" 
              icon="✨" 
            />
            <SidebarBtn 
              active={activeTab === 'settings'} 
              onClick={() => handleTabChange('settings')} 
              label="Configuración" 
              icon="⚙️" 
            />
          </nav>
          
          <button 
            onClick={onLogout} 
            className="text-gray-700 font-semibold hover:text-red-500 text-left px-4 py-2 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 md:hidden flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="flex items-center gap-2 text-fun-purple font-bold"
          >
            <span className="text-2xl">☰</span>
            <span>Menu</span>
          </button>
          <button 
            onClick={refreshData} 
            className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 font-semibold text-sm"
          >
            🔄
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {activeTab === 'results' && 'Resultados en Vivo'}
              {activeTab === 'logs' && 'Registro de Votos'}
              {activeTab === 'highlights' && 'Mejores Momentos (IA)'}
              {activeTab === 'settings' && 'Configuración'}
            </h1>
            <button 
              onClick={refreshData} 
              className="hidden md:flex bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold items-center gap-2"
            >
              🔄 Refrescar Datos
            </button>
          </div>

          {activeTab === 'results' && <ResultsTab categories={state.categories} results={results} />}
          {activeTab === 'logs' && <LogsTab votes={state.votes} categories={state.categories} />}
          {activeTab === 'highlights' && (
            <HighlightsTab 
              highlights={highlights}
              setHighlights={setHighlights}
              loading={loading}
              setLoading={setLoading}
              categories={state.categories}
              votes={state.votes}
            />
          )}
          {activeTab === 'settings' && <SettingsTab onDataChange={refreshData} setHighlights={setHighlights} />}
        </div>
      </div>
    </div>
  );
}