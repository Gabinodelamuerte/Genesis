import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Wallet, TrendingUp, Shield, Rocket, Target, ChevronRight } from 'lucide-react';
import MinorDashboard from './MinorDashboard';
import MajorDashboard from './MajorDashboard';
import { GenesisLogo } from './components/GenesisLogo';

type ViewState = 'landing' | 'register' | 'minor-dashboard' | 'major-dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [age, setAge] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) return;
    
    if (ageNum < 18) {
      setView('minor-dashboard');
    } else {
      setView('major-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingView key="landing" onStart={() => setView('register')} />
        )}
        {view === 'register' && (
          <RegisterView 
            key="register" 
            age={age} 
            setAge={setAge} 
            name={name} 
            setName={setName} 
            onSubmit={handleRegister} 
            onBack={() => setView('landing')}
          />
        )}
        {view === 'minor-dashboard' && (
          <MinorDashboard key="minor" name={name} age={age} onLogout={() => setView('landing')} />
        )}
        {view === 'major-dashboard' && (
          <MajorDashboard key="major" name={name} onLogout={() => setView('landing')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-6 py-12"
    >
      <header className="flex items-center justify-between mb-20">
        <div className="flex items-center gap-2">
          <GenesisLogo className="w-8 h-8" />
          <span className="font-display font-bold text-xl tracking-wide">GENESIS</span>
        </div>
        <div className="text-sm font-medium text-slate-400 border border-slate-800 rounded-full px-4 py-1.5 bg-slate-900/50 backdrop-blur-sm">
          Challenge BPCE
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>L'IA qui construit ton futur financier</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
        >
          Prends le contrôle de ton <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">avenir</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl"
        >
          Une plateforme évolutive qui t'accompagne de tes premières économies jusqu'à tes premiers investissements, guidée par l'intelligence artificielle.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative">Commencer l'expérience</span>
          <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </main>
    </motion.div>
  );
}

function RegisterView({ age, setAge, name, setName, onSubmit, onBack }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-6 py-12 justify-center"
    >
      <button onClick={onBack} className="absolute top-12 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> Retour
      </button>

      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <GenesisLogo className="w-16 h-16 shadow-lg shadow-purple-500/20 rounded-2xl" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-3">Créer ton profil</h2>
        <p className="text-slate-400 text-sm">Genesis s'adapte à ton âge pour t'offrir la meilleure expérience possible.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">Prénom</label>
          <input 
            id="name"
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            placeholder="Comment t'appelles-tu ?"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-medium text-slate-300">Âge</label>
          <input 
            id="age"
            type="number" 
            required
            min="10"
            max="99"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            placeholder="Quel âge as-tu ?"
          />
        </div>

        <button
          type="submit"
          disabled={!age || !name}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
        >
          Générer mon univers
        </button>
      </form>
    </motion.div>
  );
}
