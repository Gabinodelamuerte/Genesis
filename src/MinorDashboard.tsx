import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BookOpen, LineChart as ChartIcon, User, Home, Gift, Users, Link as LinkIcon, Lock, Sparkles, ChevronRight, Wallet, TrendingUp, Shield, Rocket, Target, CheckCircle2, XCircle, ArrowLeft, Share2, CreditCard } from 'lucide-react';
import { MODULES, ASSETS_CATALOG, REWARDS, THEMES } from './data/minorData';
import { GenesisLogo } from './components/GenesisLogo';
import { GenesisAI } from './components/GenesisAI';

interface Transaction {
  id: string;
  date: string;
  type: 'earn' | 'buy' | 'transfer';
  title: string;
  amount: number;
  assetSymbol?: string;
}

interface UserState {
  xp: number;
  realBalance: number;
  virtualBalance: number;
  savingsBalance: number;
  completedModules: string[];
  investments: Record<string, { amount: number, shares: number }>;
  isLinked: boolean;
  accountId: string;
  limits: {
    payment: number;
    withdrawal: number;
    onlinePurchase: boolean;
    atmWithdrawal: boolean;
  };
  transactions: Transaction[];
}

export default function MinorDashboard({ name, age, onLogout }: { name: string, age: string, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'home' | 'account' | 'learn' | 'invest' | 'profile'>('home');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  const [userState, setUserState] = useState<UserState>(() => ({
    xp: 0,
    realBalance: 50, // Montant fixe de 50€
    virtualBalance: 0, // Commence à 0¤
    savingsBalance: 0,
    completedModules: [],
    investments: {},
    isLinked: false,
    accountId: "#QHG FUT",
    limits: {
      payment: 200,
      withdrawal: 50,
      onlinePurchase: true,
      atmWithdrawal: false
    },
    transactions: []
  }));

  const level = Math.floor(userState.xp / 500) + 1;
  const nextLevelXp = level * 500;
  const currentLevelProgress = userState.xp % 500;
  const progressPercent = (currentLevelProgress / 500) * 100;

  const totalInvested = Object.values(userState.investments).reduce((acc, inv) => acc + inv.amount, 0);
  const totalPortfolioValue = userState.virtualBalance + totalInvested;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleCompleteModule = (moduleId: string, xpReward: number, moneyReward: number) => {
    if (!userState.completedModules.includes(moduleId)) {
      const module = MODULES.find(m => m.id === moduleId);
      const newTx: Transaction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        type: 'earn',
        title: `Module : ${module?.title}`,
        amount: moneyReward
      };
      setUserState(prev => ({
        ...prev,
        xp: prev.xp + xpReward,
        virtualBalance: prev.virtualBalance + moneyReward,
        completedModules: [...prev.completedModules, moduleId],
        transactions: [...(prev.transactions || []), newTx]
      }));
    }
    setActiveModuleId(null);
  };

  const handleInvest = (assetId: string, amount: number, price: number) => {
    if (userState.virtualBalance >= amount && amount > 0) {
      const asset = ASSETS_CATALOG.find(a => a.id === assetId);
      const newTx: Transaction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        type: 'buy',
        title: `Achat ${asset?.name}`,
        amount: amount,
        assetSymbol: asset?.symbol
      };
      setUserState(prev => {
        const currentInvest = prev.investments[assetId] || { amount: 0, shares: 0 };
        return {
          ...prev,
          virtualBalance: prev.virtualBalance - amount,
          investments: {
            ...prev.investments,
            [assetId]: {
              amount: currentInvest.amount + amount,
              shares: currentInvest.shares + (amount / price)
            }
          },
          transactions: [...(prev.transactions || []), newTx]
        };
      });
    }
  };

  const handleTransferToSavings = (amount: number) => {
    if (userState.realBalance >= amount && amount > 0) {
      const newTx: Transaction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        type: 'transfer',
        title: `Virement vers Livret Jeune`,
        amount: amount
      };
      setUserState(prev => ({
        ...prev,
        realBalance: prev.realBalance - amount,
        savingsBalance: prev.savingsBalance + amount,
        transactions: [...(prev.transactions || []), newTx]
      }));
    }
  };

  if (activeModuleId) {
    const module = MODULES.find(m => m.id === activeModuleId);
    if (module) {
      return <ModuleView 
        module={module} 
        onBack={() => setActiveModuleId(null)} 
        onComplete={() => handleCompleteModule(module.id, module.xpReward, module.moneyReward)} 
      />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 relative z-10">
      <div id="minor-scroll-container" className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <MinorHome 
            name={name} 
            userState={userState} 
            level={level} 
            progressPercent={progressPercent} 
            nextLevelXp={nextLevelXp}
            onOpenModule={(id) => setActiveModuleId(id)}
            onGoToLearn={() => setActiveTab('learn')}
          />
        )}
        {activeTab === 'account' && (
          <MinorAccount 
            userState={userState} 
            age={age}
            onLinkAccount={() => setUserState(prev => ({ ...prev, isLinked: true }))}
            onTransfer={handleTransferToSavings}
          />
        )}
        {activeTab === 'learn' && (
          <MinorLearn 
            userState={userState} 
            onOpenModule={(id) => setActiveModuleId(id)} 
          />
        )}
        {activeTab === 'invest' && (
          <MinorInvest 
            userState={userState} 
            totalPortfolioValue={totalPortfolioValue}
            onInvest={handleInvest}
          />
        )}
        {activeTab === 'profile' && (
          <MinorProfile 
            name={name} 
            userState={userState} 
            level={level}
            onLogout={onLogout} 
            onLinkAccount={() => setUserState(prev => ({ ...prev, isLinked: true }))}
          />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 px-6 py-4 flex justify-between items-center z-50 max-w-3xl mx-auto">
        <NavItem icon={<Home />} label="Accueil" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<CreditCard />} label="Compte" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
        <NavItem icon={<BookOpen />} label="Apprendre" active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} />
        <NavItem icon={<ChartIcon />} label="Simuler" active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} />
        <NavItem icon={<User />} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>

      <GenesisAI userContext={{ name, age, ...userState }} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}>
      {React.cloneElement(icon, { className: 'w-6 h-6' })}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MinorHome({ name, userState, level, progressPercent, nextLevelXp, onOpenModule, onGoToLearn }: any) {
  const nextReward = REWARDS.find(r => r.xpRequired > userState.xp) || REWARDS[REWARDS.length - 1];
  const nextModule = MODULES.find(m => !userState.completedModules.includes(m.id));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Salut {name} 👋</h1>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Niveau {level} • Explorateur
            </p>
          </div>
        </div>
      </header>

      {/* Balances Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Real Money */}
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-3xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">Argent de poche</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white relative z-10">{(userState.realBalance || 0).toFixed(2)} €</p>
        </div>

        {/* Virtual Money */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">Fonds Virtuels</span>
          </div>
          <p className="text-2xl font-mono font-bold text-white relative z-10">{(userState.virtualBalance || 0).toFixed(2)} ¤</p>
        </div>
      </div>

      {/* Mission / Next Module */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold text-white">Mission du jour</h3>
          <button onClick={onGoToLearn} className="text-xs text-purple-400 hover:text-purple-300 font-medium">Voir tout</button>
        </div>
        
        {nextModule ? (
          <div 
            onClick={() => onOpenModule(nextModule.id)}
            className="bg-slate-900/80 border border-slate-700 hover:border-purple-500/50 rounded-3xl p-5 flex items-center gap-4 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">À découvrir</span>
              </div>
              <h4 className="font-bold text-base text-white mb-1">{nextModule.title}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-emerald-400"/> +{nextModule.xpReward} XP</span>
                <span className="flex items-center gap-1"><Rocket className="w-3 h-3 text-emerald-400"/> +{nextModule.moneyReward} ¤</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-purple-600 flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        ) : (
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-bold text-white mb-1">Toutes les missions accomplies !</h4>
            <p className="text-emerald-400/80 text-sm">Tu es un véritable expert financier. 🎉</p>
          </div>
        )}
      </div>

      {/* Progression & Rewards */}
      <div>
        <h3 className="font-display text-lg font-bold text-white mb-4">Ta progression</h3>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <p className="text-sm text-slate-400 mb-1">Prochaine récompense</p>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {nextReward.title}
              </h4>
            </div>
            <div className="text-3xl bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">
              {nextReward.icon}
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-purple-400">{userState.xp} XP</span>
              <span className="text-slate-500">{nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 shadow-inner overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000 relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold mt-8 mb-4">Toutes les récompenses</h3>
      <div className="space-y-3">
        {REWARDS.map((reward, idx) => {
          const isUnlocked = userState.xp >= reward.xpRequired;
          return (
            <div key={idx} className={`border rounded-2xl p-4 flex items-center gap-4 ${isUnlocked ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
              <div className="text-2xl">{reward.icon}</div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${isUnlocked ? 'text-emerald-400' : 'text-slate-300'}`}>{reward.title}</h4>
                <p className="text-xs text-slate-500">Débloqué à {reward.xpRequired} XP</p>
              </div>
              {isUnlocked ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-slate-600" />}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MinorLearn({ userState, onOpenModule }: any) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  if (activeTheme) {
    const theme = THEMES.find(t => t.id === activeTheme);
    const themeModules = MODULES.filter(m => m.themeId === activeTheme);
    const completedInTheme = themeModules.filter(m => userState.completedModules.includes(m.id)).length;
    const progress = (completedInTheme / themeModules.length) * 100;

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 max-w-3xl mx-auto space-y-6">
        <header className="pt-4 mb-6">
          <button onClick={() => setActiveTheme(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour aux thèmes
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{theme?.icon}</span>
            <h1 className="font-display text-2xl font-bold">{theme?.title}</h1>
          </div>
          <p className="text-slate-400 text-sm mb-4">{theme?.description}</p>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Progression</span>
              <span>{completedInTheme} / {themeModules.length} modules</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-blue-500`} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </header>

        <div className="space-y-3">
          {themeModules.map((mod) => {
            const isDone = userState.completedModules.includes(mod.id);
            return (
              <div 
                key={mod.id} 
                onClick={() => !isDone && onOpenModule(mod.id)}
                className={`border rounded-2xl p-4 flex items-center gap-4 transition-colors ${isDone ? 'bg-slate-900/30 border-slate-800 opacity-60 cursor-default' : 'bg-slate-900/80 border-slate-700 hover:bg-slate-800 cursor-pointer'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-slate-800' : theme?.bg}`}>
                  <BookOpen className={`w-6 h-6 ${isDone ? 'text-slate-500' : theme?.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{mod.title}</h4>
                  <p className="text-xs text-slate-400">{mod.desc}</p>
                  {!isDone && <p className="text-xs text-emerald-400 mt-1">+{mod.xpReward} XP • +{mod.moneyReward} ¤</p>}
                </div>
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  </div>
                ) : (
                  <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="pt-4 mb-6">
        <h1 className="font-display text-2xl font-bold">Apprendre</h1>
        <p className="text-slate-400 text-sm">Choisis un thème pour commencer ta formation financière.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEMES.map(theme => {
          const themeModules = MODULES.filter(m => m.themeId === theme.id);
          const completedInTheme = themeModules.filter(m => userState.completedModules.includes(m.id)).length;
          const progress = themeModules.length > 0 ? (completedInTheme / themeModules.length) * 100 : 0;

          return (
            <div 
              key={theme.id} 
              onClick={() => setActiveTheme(theme.id)}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 hover:bg-slate-800/50 transition-colors cursor-pointer relative overflow-hidden group"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 ${theme.bg} rounded-full blur-2xl group-hover:blur-3xl transition-all`}></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center text-2xl shadow-inner`}>
                  {theme.icon}
                </div>
                <div className="bg-slate-950/50 px-2 py-1 rounded-lg border border-slate-800 text-xs font-medium text-slate-300">
                  {completedInTheme}/{themeModules.length}
                </div>
              </div>
              
              <div className="relative z-10 mb-4">
                <h3 className="font-bold text-lg mb-1">{theme.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{theme.description}</p>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider font-medium">
                  <span>Progression</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${theme.bg.replace('/20', '')}`} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MinorInvest({ userState, totalPortfolioValue, onInvest }: any) {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState<string>('');

  const virtualTransactions = useMemo(() => {
    return userState.transactions.filter(tx => tx.type === 'earn' || tx.type === 'buy');
  }, [userState.transactions]);

  const chartData = useMemo(() => {
    if (!virtualTransactions || virtualTransactions.length === 0) {
      return [
        { name: 'J-3', value: 0 },
        { name: 'J-2', value: 0 },
        { name: 'J-1', value: 0 },
        { name: 'Aujourd\'hui', value: 0 },
      ];
    }

    let cash = 0;
    let invested = 0;
    const data = [{ name: 'Début', value: 0 }];

    virtualTransactions.forEach((tx: any, idx: number) => {
      if (tx.type === 'earn') cash += tx.amount;
      if (tx.type === 'buy') {
        cash -= tx.amount;
        invested += tx.amount;
      }
      data.push({ name: `Tx ${idx + 1}`, value: cash + invested });
    });

    // Add simulated market evolution if invested
    if (invested > 0) {
      let currentInvested = invested;
      for (let i = 1; i <= 5; i++) {
        // Simulate some growth/volatility (e.g., +1% to +5% per step)
        const change = 1 + (Math.random() * 0.04 + 0.01); 
        currentInvested *= change;
        data.push({ name: `Mois +${i}`, value: cash + currentInvested });
      }
    }

    return data;
  }, [userState.transactions]);

  const handleBuy = () => {
    const amount = parseFloat(investAmount);
    if (!isNaN(amount) && amount > 0 && amount <= userState.virtualBalance) {
      onInvest(selectedAsset.id, amount, selectedAsset.price);
      setSelectedAsset(null);
      setInvestAmount('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="pt-4 mb-6">
        <h1 className="font-display text-2xl font-bold">Simulation</h1>
        <p className="text-slate-400 text-sm">Entraîne-toi avec de l'argent virtuel (100% fictif).</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-start relative z-10 mb-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">Valeur totale (Fonds + Investi)</p>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-mono font-bold">{(totalPortfolioValue || 0).toFixed(2)} ¤</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Fonds Disponibles</p>
            <p className="text-lg font-mono font-bold text-emerald-400">{(userState.virtualBalance || 0).toFixed(2)} ¤</p>
          </div>
        </div>

        <div className="h-48 w-full relative z-10 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}¤`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                formatter={(value: number) => [`${(value || 0).toFixed(2)} ¤`, 'Valeur']}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold mt-8 mb-4">Catalogue d'investissement</h3>
      <div className="space-y-3">
        {ASSETS_CATALOG.map((asset) => {
          const invested = userState.investments[asset.id];
          return (
            <div key={asset.id} onClick={() => setSelectedAsset(asset)} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs border border-slate-700">
                  {asset.symbol.substring(0, 3)}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{asset.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-300">{asset.type}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-300">Risque: {asset.risk}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold">{(asset.price || 0).toFixed(2)} €</div>
                <div className={`text-xs font-medium ${asset.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {asset.trend}
                </div>
                {invested && <div className="text-[10px] text-purple-400 mt-1">Investi: {(invested.amount || 0).toFixed(2)} ¤</div>}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedAsset && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-slate-900 border-t border-slate-800 p-6 rounded-t-3xl max-w-3xl mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">{selectedAsset.name}</h3>
                <p className="text-slate-400 text-sm">{(selectedAsset.price || 0).toFixed(2)} € / part</p>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Montant à investir (¤)</label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="Ex: 50"
                  max={userState.virtualBalance}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
                <button onClick={() => setInvestAmount(userState.virtualBalance.toString())} className="px-4 py-3 bg-slate-800 rounded-xl text-sm font-medium hover:bg-slate-700">
                  Max
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Fonds disponibles : {(userState.virtualBalance || 0).toFixed(2)} ¤</p>
            </div>

            <button 
              onClick={handleBuy}
              disabled={!investAmount || parseFloat(investAmount) <= 0 || parseFloat(investAmount) > userState.virtualBalance}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors"
            >
              Acheter {selectedAsset.symbol}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="font-display text-lg font-bold mt-8 mb-4">Historique des transactions (Virtuelles)</h3>
      {(!virtualTransactions || virtualTransactions.length === 0) ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 text-sm">Aucune transaction pour le moment. Complète des modules pour gagner tes premiers fonds !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {virtualTransactions.slice().reverse().map((tx: any) => (
            <div key={tx.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earn' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {tx.type === 'earn' ? <Gift className="w-5 h-5" /> : <ChartIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tx.title}</h4>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
              <div className={`font-mono font-bold ${tx.type === 'earn' ? 'text-emerald-400' : 'text-slate-300'}`}>
                {tx.type === 'earn' ? '+' : '-'}{(tx.amount || 0).toFixed(2)} ¤
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function MinorProfile({ name, userState, level, onLogout, onLinkAccount }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="pt-4 mb-6 flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Profil</h1>
        <button onClick={onLogout} className="text-sm text-slate-400 hover:text-white transition-colors">Déconnexion</button>
      </header>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/20 border-2 border-slate-950">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-slate-400 text-sm">Explorateur • Niveau {level}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Ton Identifiant Genesis</p>
          <p className="font-mono text-lg text-purple-400 font-bold">{userState.accountId}</p>
        </div>
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
          <Share2 className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold">Famille & Sécurité</h3>
        
        {userState.isLinked ? (
          <>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Compte lié</h4>
                  <p className="text-xs text-slate-400">Supervisé par : Parent / Tuteur</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded border border-emerald-500/20">Actif</span>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Autorisations parentales</h4>
                  <p className="text-xs text-slate-400">Gérées par le tuteur</p>
                </div>
              </div>
              <div className="space-y-2 pl-13">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Plafond de paiement</span>
                  <span className="text-white">{userState.limits.payment} € / mois</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Plafond de retrait</span>
                  <span className="text-white">{userState.limits.withdrawal} € / mois</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Achat en ligne</span>
                  <span className={userState.limits.onlinePurchase ? "text-emerald-400" : "text-red-400"}>
                    {userState.limits.onlinePurchase ? "Autorisé" : "Bloqué"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Retrait DAB</span>
                  <span className={userState.limits.atmWithdrawal ? "text-emerald-400" : "text-red-400"}>
                    {userState.limits.atmWithdrawal ? "Autorisé" : "Bloqué"}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-sm mb-2">Aucun compte parent lié</h4>
            <p className="text-xs text-slate-400 mb-4">Lier un compte permet de débloquer des défis familiaux et de gérer tes plafonds.</p>
            <button onClick={onLinkAccount} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors">
              Lier un compte parent
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="font-display text-lg font-bold">Parrainage</h3>
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">Invite tes amis</h4>
              <p className="text-xs text-slate-300 mb-3">Gagnez tous les deux 10€ sur votre futur compte majeur pour chaque ami invité !</p>
              <div className="flex items-center gap-2 mb-3">
                <code className="bg-slate-950 px-3 py-1.5 rounded-lg text-sm font-mono text-purple-300 border border-slate-800">GENESIS-{name.toUpperCase()}</code>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 text-xs font-medium bg-white text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                  <Share2 className="w-4 h-4" /> Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ModuleView({ module, onBack, onComplete }: any) {
  const [step, setStep] = useState<'theory' | 'quiz' | 'success'>('theory');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setError(false);
  };

  const checkAnswer = () => {
    if (selectedAnswer === module.quiz.correctAnswer) {
      setStep('success');
    } else {
      setError(true);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen bg-slate-950 text-slate-50 p-6 max-w-3xl mx-auto flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">{module.title}</h1>
          <p className="text-purple-400 text-xs font-medium">+{module.xpReward} XP • +{module.moneyReward} ¤</p>
        </div>
      </header>

      {step === 'theory' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Théorie</h2>
            <div className="text-slate-300 space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
              {module.content}
            </div>
          </div>
          <button onClick={() => setStep('quiz')} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors">
            Passer au Quiz
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-6">{module.quiz.question}</h2>
            <div className="space-y-3">
              {module.quiz.options.map((opt: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedAnswer === idx ? 'bg-purple-600/20 border-purple-500' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm mt-4 text-center">Mauvaise réponse, essaie encore !</p>}
          </div>
          <button 
            onClick={checkAnswer}
            disabled={selectedAnswer === null}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors"
          >
            Valider la réponse
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">Félicitations !</h2>
          <p className="text-slate-400 mb-8">Tu as validé ce module avec succès.</p>
          
          <div className="flex gap-4 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[120px]">
              <p className="text-xs text-slate-400 mb-1">XP Gagné</p>
              <p className="text-2xl font-bold text-purple-400">+{module.xpReward}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 min-w-[120px]">
              <p className="text-xs text-slate-400 mb-1">Fonds Virtuels</p>
              <p className="text-2xl font-bold text-emerald-400">+{module.moneyReward} ¤</p>
            </div>
          </div>

          <button onClick={onComplete} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors">
            Retour à l'accueil
          </button>
        </div>
      )}
    </motion.div>
  );
}

function MinorAccount({ userState, age, onLinkAccount, onTransfer }: any) {
  const [cardType, setCardType] = useState<'virtuelle' | 'physique' | null>(null);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [requestLabel, setRequestLabel] = useState<string>('');
  const [requestMessage, setRequestMessage] = useState<string>('');

  const handleRequestSubmit = () => {
    const amount = parseFloat(requestAmount);
    if (!isNaN(amount) && amount > 0) {
      // In a real app, this would send a notification to the parent
      alert(`Demande de ${amount}€ envoyée à ton parent !\nMotif : ${requestLabel}\nMessage : ${requestMessage}`);
      setShowRequestModal(false);
      setRequestAmount('');
      setRequestLabel('');
      setRequestMessage('');
    }
  };

  // Simulation parameters
  const interestRate = 0.03; // 3% annual
  const currentAge = parseInt(age, 10) || 15; // Use real age or fallback to 15
  const yearsToMajority = Math.max(0, 18 - currentAge);
  const monthsToMajority = yearsToMajority * 12;

  // Calculate future value with compound interest
  const calculateFutureValue = (monthly: number) => {
    const monthlyRate = interestRate / 12;
    // Future Value of a Series formula: PMT * (((1 + r)^n - 1) / r)
    const futureValueSeries = monthlyRate > 0 ? monthly * ((Math.pow(1 + monthlyRate, monthsToMajority) - 1) / monthlyRate) : monthly * monthsToMajority;
    // Future Value of current lump sum
    const futureValueLumpSum = userState.savingsBalance * Math.pow(1 + interestRate, yearsToMajority);
    return futureValueSeries + futureValueLumpSum;
  };

  const projectedValue = calculateFutureValue(monthlyContribution);
  const totalInvested = (monthlyContribution * monthsToMajority) + userState.savingsBalance;
  const totalInterest = projectedValue - totalInvested;

  const handleTransferSubmit = () => {
    const amount = parseFloat(transferAmount);
    if (!isNaN(amount) && amount > 0 && amount <= userState.realBalance) {
      onTransfer(amount);
      setShowTransferModal(false);
      setTransferAmount('');
    }
  };

  const realTransactions = useMemo(() => {
    return userState.transactions.filter(tx => tx.type === 'transfer');
  }, [userState.transactions]);

  if (!userState.isLinked) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-xl">
          <Lock className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Compte Sécurisé</h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          Pour accéder à ton compte courant, ta carte bancaire et ton livret d'épargne, tu dois d'abord lier ton compte à celui d'un parent ou tuteur légal.
        </p>
        <button 
          onClick={onLinkAccount}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/25"
        >
          Lier un compte parent
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-6">
      <header className="pt-4 mb-6">
        <h1 className="font-display text-2xl font-bold">Mon Compte</h1>
        <p className="text-slate-400 text-sm">Gère ton argent de poche et ton épargne.</p>
      </header>

      {/* Compte Courant */}
      <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <h2 className="font-medium text-slate-300">Compte Courant</h2>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/20">Disponible</span>
          </div>
          <p className="text-4xl font-mono font-bold text-white mb-6">{(userState.realBalance || 0).toFixed(2)} €</p>
          
          <div className="flex gap-3">
            <button onClick={() => setShowTransferModal(true)} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
              Verser sur livret
            </button>
            <button 
              onClick={() => setShowRequestModal(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              Demander de l'argent
            </button>
          </div>
        </div>
      </div>

      {/* Carte Bancaire */}
      <h3 className="font-display text-lg font-bold mt-8 mb-4">Ma Carte Bancaire</h3>
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        {!cardType ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-300 mb-6">Tu n'as pas encore de carte bancaire.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setCardType('virtuelle')} className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl text-sm font-medium transition-colors">
                Créer une carte virtuelle
              </button>
              <button onClick={() => setCardType('physique')} className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors">
                Commander une carte physique
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-sm mx-auto aspect-[1.586] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2">
                <GenesisLogo className="w-6 h-6" />
                <span className="font-display font-bold text-lg tracking-widest text-slate-300">GENESIS</span>
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-5 bg-slate-300/20 rounded-sm"></div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="font-mono text-lg tracking-widest text-slate-300 mb-2">
                **** **** **** 1234
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Titulaire</div>
                  <div className="text-sm font-medium text-slate-300 uppercase">Utilisateur</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Type</div>
                  <div className="text-xs font-medium text-purple-400">{cardType === 'virtuelle' ? 'Virtuelle' : 'Physique'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Épargne (Livret Jeune) */}
      <h3 className="font-display text-lg font-bold mt-8 mb-4">Mon Épargne</h3>
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Livret Jeune Genesis</h4>
              <p className="text-xs text-slate-400">Taux : 3% net / an</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Bloqué jusqu'à 18 ans
          </span>
        </div>
        
        <div className="mb-6 relative z-10">
          <p className="text-3xl font-mono font-bold text-white">{(userState.savingsBalance || 0).toFixed(2)} €</p>
          <p className="text-xs text-emerald-400 mt-1">+{(userState.savingsBalance * interestRate || 0).toFixed(2)} € d'intérêts annuels estimés</p>
        </div>

        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 relative z-10 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-sm font-bold text-slate-300">Plan d'épargne programmé</h5>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">Actif</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Ton parent verse automatiquement <strong className="text-white">{monthlyContribution} € / mois</strong> sur ce livret.
          </p>
          <button 
            onClick={() => setShowPlanModal(true)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
          >
            Simuler mon épargne à 18 ans
          </button>
        </div>
        
        <p className="text-[10px] text-slate-500 leading-relaxed relative z-10 text-center">
          Les fonds déposés ici génèrent des intérêts composés mais ne pourront être retirés qu'à ta majorité.
        </p>
      </div>

      <h3 className="font-display text-lg font-bold mt-8 mb-4">Historique bancaire</h3>
      {(!realTransactions || realTransactions.length === 0) ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 text-sm">Aucune transaction bancaire pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {realTransactions.slice().reverse().map((tx: any) => (
            <div key={tx.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{tx.title}</h4>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
              <div className="font-mono font-bold text-slate-300">
                -{(tx.amount || 0).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Money Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-slate-900 border-t border-slate-800 p-6 rounded-t-3xl max-w-3xl mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Demander de l'argent</h3>
                <p className="text-slate-400 text-sm">Envoie une demande d'argent à ton parent.</p>
              </div>
              <button onClick={() => setShowRequestModal(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Montant (€)</label>
                <input 
                  type="number" 
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="Ex: 15"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Motif / Libellé</label>
                <select 
                  value={requestLabel}
                  onChange={(e) => setRequestLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Sélectionner un motif</option>
                  <option value="Argent de poche">Argent de poche</option>
                  <option value="Sortie entre amis">Sortie entre amis</option>
                  <option value="Jeux Vidéo / Loisirs">Jeux Vidéo / Loisirs</option>
                  <option value="Vêtements">Vêtements</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message personnalisé (Optionnel)</label>
                <textarea 
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Explique pourquoi tu as besoin de cet argent..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                />
              </div>
            </div>

            <button 
              onClick={handleRequestSubmit}
              disabled={!requestAmount || parseFloat(requestAmount) <= 0 || !requestLabel}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors"
            >
              Envoyer la demande
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulation Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-slate-900 border-t border-slate-800 p-6 rounded-t-3xl max-w-3xl mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Verser sur mon Livret</h3>
                <p className="text-slate-400 text-sm">Transfère tes fonds vers ton épargne sécurisée.</p>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Montant à transférer (€)</label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Ex: 20"
                  max={userState.realBalance}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <button onClick={() => setTransferAmount(userState.realBalance.toString())} className="px-4 py-3 bg-slate-800 rounded-xl text-sm font-medium hover:bg-slate-700">
                  Max
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Fonds disponibles : {(userState.realBalance || 0).toFixed(2)} €</p>
            </div>

            <button 
              onClick={handleTransferSubmit}
              disabled={!transferAmount || parseFloat(transferAmount) <= 0 || parseFloat(transferAmount) > userState.realBalance}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors"
            >
              Confirmer le virement
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlanModal && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-slate-900 border-t border-slate-800 p-6 rounded-t-3xl max-w-3xl mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Simulation à 18 ans</h3>
                <p className="text-slate-400 text-sm">Découvre la magie des intérêts composés !</p>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Versement mensuel du parent (€)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  step="10"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="font-mono font-bold text-lg w-16 text-right">{monthlyContribution} €</span>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 mb-6">
              <p className="text-sm text-slate-400 mb-2">Capital estimé à tes 18 ans (dans {yearsToMajority} ans) :</p>
              <p className="text-4xl font-mono font-bold text-emerald-400 mb-4">{(projectedValue || 0).toFixed(2)} €</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total versé par tes parents :</span>
                  <span className="text-slate-300">{(totalInvested || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-500/70">Intérêts générés (magie !) :</span>
                  <span className="text-emerald-400">+{(totalInterest || 0).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowPlanModal(false)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors"
            >
              Fermer la simulation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

