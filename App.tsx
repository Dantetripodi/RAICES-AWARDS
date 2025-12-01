import { useState, useEffect } from 'react';
import { AppState, UserRole } from './types';
import { loadState, hasStudentVoted } from './services/storageService';
import LandingView from './components/Landing/LandingView';
import StudentVotingView from './components/Student/StudentVotingView';
import AdminDashboard from './components/Admin/AdminDashboard';

export default function App() {
  const [view, setView] = useState<UserRole>(UserRole.LANDING);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const freshState = await loadState();
      setAppState(freshState);
      setLoading(false);
    };
    loadData();
  }, [view]);

  const handleLoginStudent = async (name: string) => {
    if (!name.trim()) return;
    const voted = await hasStudentVoted(name);
    if (voted) {
      alert('¡Ya has votado! Gracias por participar.');
      return;
    }
    setCurrentUser(name);
    setView(UserRole.STUDENT);
  };

  const handleLoginAdmin = (password: string) => {
    if (appState && password === appState.adminPassword) {
      setView(UserRole.ADMIN);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  if (loading || !appState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fun-purple to-fun-pink">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl font-bold">Cargando...</p>
        </div>
      </div>
    );
  }

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