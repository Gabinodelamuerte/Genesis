import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Wallet, TrendingUp, Shield, Rocket, Target, ChevronRight, Mail, Phone, Calendar, User as UserIcon, X, Bell } from 'lucide-react';
import MinorDashboard from './MinorDashboard';
import MajorDashboard from './MajorDashboard';
import { GenesisLogo } from './components/GenesisLogo';

type ViewState = 'landing' | 'register' | 'login' | 'create-password' | 'minor-dashboard' | 'major-dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [name, setName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(new Array(6).fill(''));
  const [notification, setNotification] = useState<string | null>(null);
  const [loginCode, setLoginCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [storedPassword, setStoredPassword] = useState<string>('135790'); // Default for demo

  const calculateAge = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTwoFactorOpen(true);
    
    // Simulate SMS notification
    setTimeout(() => {
      setNotification("Code de vérification BPCE : 482 915");
    }, 1500);
  };

  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code === '482915') {
      setIsTwoFactorOpen(false);
      setView('create-password');
    } else {
      alert("Code incorrect. Essayez 482915");
    }
  };

  const validateCode = (code: string) => {
    if (code.length < 6) return "Le code doit comporter 6 chiffres";
    
    // No successive identical digits (e.g., 11)
    for (let i = 0; i < code.length - 1; i++) {
      if (code[i] === code[i+1]) return "Le code ne doit pas contenir deux chiffres successifs identiques (ex: 11)";
    }
    
    // No sequences (e.g., 123 or 321)
    for (let i = 0; i < code.length - 2; i++) {
      const d1 = parseInt(code[i]);
      const d2 = parseInt(code[i+1]);
      const d3 = parseInt(code[i+2]);
      if (d2 === d1 + 1 && d3 === d2 + 1) return "Le code ne doit pas contenir de suite de chiffres (ex: 123)";
      if (d2 === d1 - 1 && d3 === d2 - 1) return "Le code ne doit pas contenir de suite de chiffres (ex: 321)";
    }
    
    return null;
  };

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateCode(password);
    if (error) {
      setPasswordError(error);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    
    setStoredPassword(password);
    const age = calculateAge(birthDate);
    if (age < 18) {
      setView('minor-dashboard');
    } else {
      setView('major-dashboard');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateCode(loginCode);
    if (error) {
      setLoginError(error);
      return;
    }
    
    if (loginCode !== storedPassword) {
      setLoginError("Mot de passe incorrect");
      return;
    }
    
    // For demo, if code is valid, just log in as a major
    setName("Gabin");
    setView('major-dashboard');
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Notification Simulation */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: 20 }}
            animate={{ opacity: 1, y: 20, x: -20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 right-0 z-[200] w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Message</span>
                <span className="text-[10px] text-slate-500">Maintenant</span>
              </div>
              <p className="text-sm font-medium text-white">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingView 
            key="landing" 
            onStart={() => setView('register')} 
            onLogin={() => setView('login')}
          />
        )}
        {view === 'register' && (
          <RegisterView 
            key="register" 
            name={name} setName={setName}
            birthDate={birthDate} setBirthDate={setBirthDate}
            phone={phone} setPhone={setPhone}
            email={email} setEmail={setEmail}
            onSubmit={handleRegisterSubmit} 
            onBack={() => setView('landing')}
          />
        )}
        {view === 'login' && (
          <LoginView
            key="login"
            code={loginCode}
            setCode={setLoginCode}
            error={loginError}
            onSubmit={handleLogin}
            onBack={() => setView('landing')}
          />
        )}
        {view === 'create-password' && (
          <CreatePasswordView
            key="create-password"
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            error={passwordError}
            onSubmit={handleCreatePassword}
          />
        )}
        {view === 'minor-dashboard' && (
          <MinorDashboard key="minor" name={name} age={calculateAge(birthDate).toString()} onLogout={() => setView('landing')} />
        )}
        {view === 'major-dashboard' && (
          <MajorDashboard key="major" name={name} onLogout={() => setView('landing')} />
        )}
      </AnimatePresence>

      {/* 2FA Modal */}
      <AnimatePresence>
        {isTwoFactorOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsTwoFactorOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-600" />
              
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center mb-2">Vérification</h3>
              <p className="text-slate-400 text-center text-sm mb-8">
                Nous avons envoyé un code de sécurité à <span className="text-white font-medium">{phone || email}</span>
              </p>

              <div className="flex justify-between gap-2 mb-8">
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val || e.target.value === '') {
                        const newCode = [...verificationCode];
                        newCode[idx] = val;
                        setVerificationCode(newCode);
                        // Auto focus next
                        if (val && idx < 5) {
                          const nextInput = e.target.nextElementSibling as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !verificationCode[idx] && idx > 0) {
                        const prevInput = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    className="w-12 h-14 bg-slate-800 border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                Vérifier le code
              </button>

              <button 
                onClick={() => setIsTwoFactorOpen(false)}
                className="w-full mt-4 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingView({ onStart, onLogin }: { onStart: () => void, onLogin: () => void }) {
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

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Commencer l'expérience</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={onLogin}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 text-white rounded-full font-semibold text-lg transition-all hover:bg-slate-800 active:scale-95 w-full sm:w-auto justify-center"
          >
            Se connecter
          </motion.button>
        </div>
      </main>
    </motion.div>
  );
}

function RegisterView({ name, setName, birthDate, setBirthDate, phone, setPhone, email, setEmail, onSubmit, onBack }: any) {
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
        <p className="text-slate-400 text-sm">Genesis s'adapte à ton profil pour t'offrir la meilleure expérience possible.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <UserIcon className="w-3.5 h-3.5" /> Prénom
          </label>
          <input 
            id="name"
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            placeholder="Ton prénom"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="birthDate" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" /> Date de naissance
          </label>
          <input 
            id="birthDate"
            type="date" 
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Phone className="w-3.5 h-3.5" /> Numéro de téléphone
          </label>
          <input 
            id="phone"
            type="tel" 
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            placeholder="06 00 00 00 00"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" /> Email
          </label>
          <input 
            id="email"
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            placeholder="ton@email.com"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            S'inscrire <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Double authentification requise
          </p>
        </div>
      </form>
    </motion.div>
  );
}

function CreatePasswordView({ password, setPassword, confirmPassword, setConfirmPassword, error, onSubmit }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-6 py-12 justify-center"
    >
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <GenesisLogo className="w-16 h-16 shadow-lg shadow-purple-500/20 rounded-2xl" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-3">Sécurise ton compte</h2>
        <p className="text-slate-400 text-sm">Choisis un code secret à 6 chiffres pour tes prochaines connexions.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">Nouveau mot de passe</label>
          <input 
            id="newPassword"
            type="password" 
            required
            maxLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-4 text-center text-3xl tracking-[1em] font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            placeholder="••••••"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">Confirmation du mot de passe</label>
          <input 
            id="confirmPassword"
            type="password" 
            required
            maxLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-4 text-center text-3xl tracking-[1em] font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            placeholder="••••••"
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-medium mt-2 bg-red-400/10 p-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Règles de sécurité :</p>
          <ul className="text-[11px] text-slate-400 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-600" /> Pas de suite de chiffres (ex: 123)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-600" /> Pas de chiffres successifs identiques (ex: 11)
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={password.length < 6 || confirmPassword.length < 6}
          className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 shadow-xl"
        >
          Valider mon code
        </button>
      </form>
    </motion.div>
  );
}

function LoginView({ code, setCode, error, onSubmit, onBack }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-6 py-12 justify-center"
    >
      <button onClick={onBack} className="absolute top-12 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> Retour
      </button>

      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <GenesisLogo className="w-16 h-16 shadow-lg shadow-purple-500/20 rounded-2xl" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-3">Bon retour !</h2>
        <p className="text-slate-400 text-sm">Entre ton code secret pour accéder à ton univers.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="loginCode" className="block text-sm font-medium text-slate-300">Code secret (6 chiffres)</label>
          <input 
            id="loginCode"
            type="password" 
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className={`w-full bg-slate-900/50 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-2xl px-4 py-4 text-center text-3xl tracking-[1em] font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
            placeholder="••••••"
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs font-medium mt-2 bg-red-400/10 p-3 rounded-xl border border-red-400/20"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Règles de sécurité :</p>
          <ul className="text-[11px] text-slate-400 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-600" /> Pas de suite de chiffres (ex: 123)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-600" /> Pas de chiffres successifs identiques (ex: 11)
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={code.length < 6}
          className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 shadow-xl"
        >
          Se connecter
        </button>
      </form>
    </motion.div>
  );
}
