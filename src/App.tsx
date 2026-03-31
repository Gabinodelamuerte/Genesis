import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Wallet, TrendingUp, Shield, Rocket, Target, ChevronRight, Mail, Phone, Calendar, User as UserIcon, X, Bell } from 'lucide-react';
import MinorDashboard from './MinorDashboard';
import MajorDashboard from './MajorDashboard';
import { GenesisLogo } from './components/GenesisLogo';
import CGU from './components/CGU';

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
  const [showCookies, setShowCookies] = useState(true);
  const [cookieSettings, setCookieSettings] = useState({
    ia: true,
    analytics: true,
    social: false
  });
  const [isCustomizingCookies, setIsCustomizingCookies] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showGlobalPrivacyModal, setShowGlobalPrivacyModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showCGUModal, setShowCGUModal] = useState(false);

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
    if (!acceptedPrivacy) {
      setPasswordError("Vous devez accepter la politique de confidentialité");
      return;
    }
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
    
    if (loginCode === '040504') {
      setName("Gabin");
      setView('major-dashboard');
      return;
    }

    if (loginCode === '040404') {
      setName("Gabin");
      setView('minor-dashboard');
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
            className="fixed top-0 right-0 z-[200] w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl flex items-start gap-3 notification-box"
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

      <AnimatePresence>
        {showCookies && (
          <CookieConsent 
            onAcceptAll={() => {
              setCookieSettings({ ia: true, analytics: true, social: false });
              setShowCookies(false);
            }}
            onRejectAll={() => {
              setCookieSettings({ ia: false, analytics: false, social: false });
              setShowCookies(false);
            }}
            onSave={(settings: any) => {
              setCookieSettings(settings);
              setShowCookies(false);
            }}
            isCustomizing={isCustomizingCookies}
            setIsCustomizing={setIsCustomizingCookies}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGlobalPrivacyModal && (
          <PrivacyModal onClose={() => setShowGlobalPrivacyModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLegalModal && (
          <LegalModal onClose={() => setShowLegalModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCGUModal && (
          <CGU onClose={() => setShowCGUModal(false)} />
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
            acceptedPrivacy={acceptedPrivacy}
            setAcceptedPrivacy={setAcceptedPrivacy}
            onShowPrivacy={() => setShowGlobalPrivacyModal(true)}
            error={passwordError}
            onSubmit={handleCreatePassword}
          />
        )}
        {view === 'minor-dashboard' && (
          <MinorDashboard 
            key="minor" 
            name={name} 
            age={calculateAge(birthDate).toString()} 
            onLogout={() => setView('landing')} 
            onShowPrivacy={() => setShowGlobalPrivacyModal(true)}
            onShowLegal={() => setShowLegalModal(true)}
            onShowCGU={() => setShowCGUModal(true)}
          />
        )}
        {view === 'major-dashboard' && (
          <MajorDashboard 
            key="major" 
            name={name} 
            onLogout={() => setView('landing')} 
            onShowPrivacy={() => setShowGlobalPrivacyModal(true)}
            onShowLegal={() => setShowLegalModal(true)}
            onShowCGU={() => setShowCGUModal(true)}
          />
        )}
      </AnimatePresence>

      {/* Global Footer for non-dashboard views */}
      {(view === 'landing' || view === 'register' || view === 'login' || view === 'create-password') && (
        <div className="relative z-10 pb-8">
          <Footer 
            onShowPrivacy={() => setShowGlobalPrivacyModal(true)} 
            onShowLegal={() => setShowLegalModal(true)}
            onShowCGU={() => setShowCGUModal(true)}
          />
        </div>
      )}

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
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl overflow-hidden"
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

function CookieConsent({ onAcceptAll, onRejectAll, onSave, isCustomizing, setIsCustomizing }: any) {
  const [settings, setSettings] = useState({
    ia: true,
    analytics: true,
    social: false
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
      />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-slate-900/40 border border-white/10 rounded-3xl md:rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden max-h-[90vh] flex flex-col backdrop-blur-2xl"
      >
        {/* Header Section */}
        <div className="p-6 md:p-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-purple-500/20 shrink-0">
              🍪
            </div>
            <div>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-1">Confidentialité</p>
              <h3 className="text-xl md:text-3xl font-display font-bold text-white tracking-tight">Gère tes données, contrôle ton aventure !</h3>
            </div>
          </div>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
            Chez Genesis, on pense que la liberté financière commence par le contrôle de ses propres données. Avant d'explorer l'app, choisis ce que tu nous confies.
          </p>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!isCustomizing ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl p-4 md:p-6 transition-all duration-300">
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h4 className="font-bold text-base md:text-lg text-white">🔒 Les Indispensables</h4>
                        <span className="text-[8px] md:text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-slate-400 uppercase tracking-widest whitespace-nowrap">Toujours actifs</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-3">
                        Ceux-là, on ne peut pas s'en passer. Ils servent à te connecter de façon sécurisée et à vérifier que tu es bien un humain.
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Base légale :</span>
                        <span className="text-[10px] text-slate-400 italic">Intérêt légitime / Sécurité</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: "🤖", label: "IA Perso", desc: "Défis sur-mesure" },
                    { icon: "📊", label: "Analyse", desc: "Amélioration app" },
                    { icon: "📢", label: "Réseaux", desc: "Partage exploits", disabled: true }
                  ].map((item, i) => (
                    <div key={i} className={`bg-white/5 border border-white/10 rounded-3xl p-4 md:p-5 flex flex-col items-center text-center ${item.disabled ? 'opacity-40' : 'hover:bg-white/10 transition-colors'}`}>
                      <span className="text-2xl md:text-3xl mb-3">{item.icon}</span>
                      <p className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="customize"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {[
                  { 
                    id: 'ia', 
                    icon: "🤖", 
                    title: "L'IA Personnalisée", 
                    desc: "C'est le cerveau de Genesis. En l'activant, tu permets à l'IA d'analyser tes simulations pour te proposer des défis sur-mesure (ex: économiser pour ton premier appart).",
                    note: "Tes données de simulation sont pseudonymisées. Base légale : Consentement explicite."
                  },
                  { 
                    id: 'analytics', 
                    icon: "📊", 
                    title: "Analyse de l'expérience", 
                    desc: "Pour savoir si nos jeux et nos cours te plaisent. Cela nous aide à améliorer l'app sans jamais savoir qui tu es personnellement.",
                    note: "Base légale : Consentement."
                  },
                  { 
                    id: 'social', 
                    icon: "📢", 
                    title: "Réseaux & Partenaires", 
                    desc: "Partager tes exploits sur tes réseaux. Note : Si tu as moins de 15 ans, cette option reste désactivée pour protéger ta vie privée.",
                    note: "Base légale : Consentement (et autorisation parentale si <15 ans).",
                    disabled: true
                  }
                ].map((item) => (
                  <div key={item.id} className={`bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 flex items-center justify-between gap-4 md:gap-6 ${item.disabled ? 'opacity-60' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl md:text-2xl">{item.icon}</span>
                        <h4 className="font-bold text-sm md:text-base text-white">{item.title}</h4>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed mb-3">{item.desc}</p>
                      <p className="text-[10px] text-slate-500 italic">{item.note}</p>
                    </div>
                    <button 
                      onClick={() => !item.disabled && setSettings({...settings, [item.id]: !((settings as any)[item.id])})}
                      disabled={item.disabled}
                      className={`w-12 h-6 md:w-14 md:h-7 rounded-full transition-all relative shrink-0 ${item.disabled ? 'bg-slate-800' : (settings as any)[item.id] ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full transition-all shadow-sm ${item.disabled ? 'left-1 bg-slate-600' : (settings as any)[item.id] ? 'left-7 md:left-8' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Section */}
        <div className="p-6 md:p-10 pt-0">
          {!isCustomizing ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button
                  onClick={onAcceptAll}
                  className="group relative py-4 md:py-5 bg-white text-slate-950 rounded-2xl md:rounded-[2rem] font-bold text-sm md:text-base overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Tout accepter</span>
                </button>
                <button
                  onClick={onRejectAll}
                  className="py-4 md:py-5 bg-slate-800 text-white border border-white/10 rounded-2xl md:rounded-[2rem] font-bold text-sm md:text-base hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Tout refuser
                </button>
              </div>
              <button
                onClick={() => setIsCustomizing(true)}
                className="py-2 text-slate-500 hover:text-purple-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Personnaliser mes choix
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => onSave(settings)}
                className="py-4 md:py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl md:rounded-[2rem] font-bold text-sm md:text-base hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-500/20 transition-all"
              >
                Enregistrer mes préférences
              </button>
              <button
                onClick={() => setIsCustomizing(false)}
                className="py-2 text-slate-500 hover:text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Retour à l'aperçu
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function Footer({ onShowPrivacy, onShowLegal, onShowCGU }: { onShowPrivacy?: () => void, onShowLegal?: () => void, onShowCGU?: () => void }) {
  return (
    <footer className="py-8 text-center border-t border-white/5 mt-auto">
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-6">
        © COPYRIGHT - TOUS DROITS RÉSERVÉS - GROUPE BPCE - BANQUE POPULAIRE - CAISSE D'EPARGNE
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <p 
          onClick={onShowLegal}
          className="text-[9px] text-slate-700 uppercase tracking-widest cursor-pointer hover:text-slate-500"
        >
          Mentions Légales
        </p>
        <p 
          onClick={onShowCGU}
          className="text-[9px] text-slate-700 uppercase tracking-widest cursor-pointer hover:text-slate-500"
        >
          CGU
        </p>
        <p 
          onClick={onShowPrivacy}
          className="text-[9px] text-slate-700 uppercase tracking-widest cursor-pointer hover:text-slate-500"
        >
          Protection des données
        </p>
      </div>
    </footer>
  );
}

function LegalModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Mentions légales</h2>
              <p className="text-slate-400 text-sm">Date de dernière mise à jour : le 03/09/2025</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="space-y-8 text-slate-300">
            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                Identification du responsable du site
              </h3>
              <div className="bg-white/5 rounded-2xl p-6 space-y-4 text-sm leading-relaxed">
                <p>
                  <span className="font-bold text-white">BPCE S.A.</span> au capital de 155 742 320 euros<br />
                  RCS Paris : 493 455 042<br />
                  N° TVA intracommunautaire : FR 24 493 455 042
                </p>
                <p>
                  <span className="font-bold text-white">Siège social :</span><br />
                  50, avenue Pierre Mendès France, 75201 Paris Cedex 13
                </p>
                <p>
                  <span className="font-bold text-white">Directeur de la publication :</span><br />
                  Nicolas Namias
                </p>
                <p className="pt-2 border-t border-white/5">
                  Site édité par : <span className="text-purple-400 font-medium">Gabin Devos, Simon Morantin, Matthieu Delvalez, Florian Duhamel</span>
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                Hébergeur du site
              </h3>
              <div className="bg-white/5 rounded-2xl p-6 space-y-4 text-sm leading-relaxed">
                <p className="font-bold text-white text-base">ONRENDER</p>
                <p>
                  <span className="font-bold text-white">Siège social :</span><br />
                  Render, Inc., 2261 Market Street #294, San Francisco, CA 94114, USA
                </p>
              </div>
            </section>
          </div>
        </div>
        
        <div className="p-8 bg-slate-950/50 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Fermer
          </button>
        </div>
      </motion.div>
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

function CreatePasswordView({ password, setPassword, confirmPassword, setConfirmPassword, acceptedPrivacy, setAcceptedPrivacy, onShowPrivacy, error, onSubmit }: any) {
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

        <div className="flex items-start gap-3 px-2">
          <input 
            id="privacy"
            type="checkbox"
            required
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-purple-600 focus:ring-purple-500/50"
          />
          <label htmlFor="privacy" className="text-xs text-slate-400 leading-relaxed">
            J'ai lu et j'accepte la <span onClick={onShowPrivacy} className="text-purple-400 hover:text-purple-300 cursor-pointer underline underline-offset-2">politique de confidentialité</span> de Genesis.
          </label>
        </div>

        <button
          type="submit"
          disabled={password.length < 6 || confirmPassword.length < 6 || !acceptedPrivacy}
          className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 shadow-xl"
        >
          Valider mon code
        </button>
      </form>
    </motion.div>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md md:max-w-lg w-full shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">Politique de confidentialité</h3>
        </div>
        
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            Les données personnelles recueillies dans le cadre des services Genesis sont traitées selon des protocoles sécurisés (Chiffrement AES-256 et TLS 1.3).
          </p>
          <p>
            Elles permettent à Genesis et aux entités du Groupe BPCE concernées de gérer les demandes et d'assurer le suivi pédagogique.
          </p>
          <p>
            En cas de transmission à des sous-traitants techniques (hébergement Render/IA), celle-ci est strictement encadrée par des clauses de confidentialité.
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
        >
          Fermer
        </button>
      </motion.div>
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
