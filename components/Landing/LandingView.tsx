import { useState } from 'react';

interface LandingViewProps {
  onStudentEnter: (name: string) => void;
  onAdminEnter: (password: string) => void;
}

export default function LandingView({ onStudentEnter, onAdminEnter }: LandingViewProps) {
  const [mode, setMode] = useState<'selection' | 'student' | 'admin'>('selection');
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = () => {
    if (mode === 'student') onStudentEnter(inputVal);
    if (mode === 'admin') onAdminEnter(inputVal);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-fun-purple to-fun-pink text-white">
      <h1 className="text-5xl font-bold mb-8 text-center drop-shadow-lg">🏆RAICES AWARDS</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-gray-800">
        {mode === 'selection' && (
          <div className="space-y-4">
            <h2 className="text-2xl text-center mb-6 font-bold text-fun-purple">¿Quién eres?</h2>
            <button onClick={() => setMode('student')} className="w-full py-4 bg-fun-yellow hover:bg-yellow-400 text-white rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-md">
              🎒GUIADO
            </button>
            <button onClick={() => setMode('admin')} className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl text-xl font-bold transition">
              👨‍🏫GUIA
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