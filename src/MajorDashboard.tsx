import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, CreditCard, Shield, TrendingUp, User, Wallet, ChevronRight, CheckCircle2, Lock, Sparkles, Building2, Briefcase, Plus, ArrowRight, PieChart as PieChartIcon, Trash2, History, ArrowUpRight, ArrowDownRight, ArrowLeft, Download, Search, Car, HeartPulse, Landmark, Dog, ArrowRightLeft, CheckCircle, Trophy, BookOpen, X, XCircle, Pencil, Users, Coins, RefreshCw, Globe, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { GenesisLogo } from './components/GenesisLogo';
import { GenesisAI } from './components/GenesisAI';
import { MAJOR_REWARDS, MAJOR_CHALLENGES } from './data/majorData';

interface MajorState {
  xp: number;
  realBalance: number;
  accountId: string;
  linkedBanks: string[];
  linkedInsurances: string[];
  linkedInvestments: string[];
  incomes: { id: string; name: string; amount: number }[];
  expenses: { id: string; name: string; amount: number }[];
  savingsAccounts: { id: string; name: string; balance: number; rate: number; ceiling: number; transactions?: { id: string; date: string; label: string; amount: number; type: 'income' | 'expense' | 'transfer' }[] }[];
  transactions: { id: string; date: string; label: string; amount: number; type: 'income' | 'expense' | 'transfer' }[];
  cardType: 'virtuelle' | 'physique' | null;
  investments: { id: string; name: string; active: boolean; balance: number; performance: number }[];
  holdings: { id: string; accountId: string; name: string; ticker: string; shares: number; value: number; performance: number }[];
  investTransactions: { id: string; accountId: string; date: string; label: string; amount: number; type: 'buy' | 'sell' | 'transfer' }[];
  userInsurances: { id: string; type: string; provider: string; monthlyPrice: number }[];
  completedChallenges: string[];
  beneficiaries: { id: string; name: string; iban: string; bank: string }[];
  childAccount: { linked: boolean; id: string; name: string; balance: number; limits: { payment: number; withdrawal: number; onlinePurchase: boolean; atmWithdrawal: boolean } } | null;
  realTimePrices: Record<string, { price: number; trend: string; name: string }>;
}

const BANKS = ["Banque populaire", "Caisse d'épargne", "Casden", "Oney", "Palatine", "Crédit Coopératif"];
const INSURANCES = ["Banques Populaires", "Caisse d'épargne", "Assurances IARD"];
const INVESTMENTS = ["BPCE vie", "BPCE Life", "Banques populaires", "Palatine", "Caisse d'épargne"];

export default function MajorDashboard({ name, onLogout }: { name: string, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'home' | 'account' | 'gestion' | 'insurance' | 'invest' | 'profile' | 'gamification'>('home');
  const [pendingChildRequest, setPendingChildRequest] = useState<any>(null);
  
  const [userState, setUserState] = useState<MajorState>({
    xp: 150,
    realBalance: 1250.50,
    accountId: "#QHG FUT",
    linkedBanks: [],
    linkedInsurances: [],
    linkedInvestments: [],
    incomes: [
      { id: '1', name: 'Salaire', amount: 2500 },
      { id: '2', name: 'Allocations', amount: 150 }
    ],
    expenses: [
      { id: '1', name: 'Loyer', amount: 800 },
      { id: '2', name: 'Assurance Auto', amount: 60 },
      { id: '3', name: 'Abonnements', amount: 40 },
      { id: '4', name: 'Électricité / Gaz', amount: 100 },
      { id: '5', name: 'Internet / Mobile', amount: 50 },
    ],
    savingsAccounts: [
      { id: '1', name: 'Livret A', balance: 3200.00, rate: 3.0, ceiling: 22950, transactions: [] },
      { id: '2', name: 'LDDS', balance: 1300.00, rate: 3.0, ceiling: 12000, transactions: [] }
    ],
    transactions: [
      { id: 't1', date: 'Aujourd\'hui', label: 'Paiement Supermarché', amount: -45.20, type: 'expense' },
      { id: 't2', date: 'Hier', label: 'Virement Salaire', amount: 2500.00, type: 'income' },
      { id: 't3', date: '12 Mars', label: 'Abonnement Netflix', amount: -13.99, type: 'expense' }
    ],
    cardType: 'physique',
    investments: [
      { id: 'pea', name: 'PEA', active: true, balance: 800.00, performance: 5.2 },
      { id: 'av', name: 'Assurance Vie', active: false, balance: 0, performance: 0 },
      { id: 'cto', name: 'Compte-Titres (CTO)', active: false, balance: 0, performance: 0 }
    ],
    holdings: [
      { id: 'h1', accountId: 'pea', name: 'Amundi MSCI World', ticker: 'CW8.PA', shares: 2, value: 800, performance: 5.2 }
    ],
    investTransactions: [
      { id: 'it1', accountId: 'pea', date: '10 Mars', label: 'Achat CW8.PA', amount: -800, type: 'buy' }
    ],
    userInsurances: [
      { id: 'ins1', type: 'auto', provider: 'Axa', monthlyPrice: 65 },
    ],
    completedChallenges: [],
    beneficiaries: [
      { id: 'b1', name: 'Marie Durand', iban: 'FR76 3000 4000 0001 2345 6789 012', bank: 'Caisse d\'Épargne' },
      { id: 'b2', name: 'Thomas Petit', iban: 'FR76 1020 3040 5006 7080 9010 112', bank: 'Banque Populaire' }
    ],
    childAccount: {
      linked: false,
      id: "",
      name: "",
      balance: 0,
      limits: { payment: 200, withdrawal: 50, onlinePurchase: true, atmWithdrawal: false }
    },
    realTimePrices: {}
  });

  const level = Math.floor(userState.xp / 1000) + 1;
  const nextLevelXp = level * 1000;
  const currentLevelProgress = userState.xp % 1000;
  const progressPercent = (currentLevelProgress / 1000) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const fetchPrices = async () => {
      const tickers = Array.from(new Set([
        ...ASSETS_TO_BUY.map(a => a.ticker),
        ...userState.holdings.map(h => h.ticker)
      ]));

      const newPrices: Record<string, any> = { ...userState.realTimePrices };
      let hasChanged = false;

      for (const ticker of tickers) {
        try {
          const response = await fetch(`/api/stock/${ticker}`);
          if (response.ok) {
            const data = await response.json();
            newPrices[ticker] = {
              price: data.price,
              trend: data.change >= 0 ? `+${data.change.toFixed(2)}%` : `${data.change.toFixed(2)}%`,
              name: data.name
            };
            hasChanged = true;
          }
        } catch (error) {
          console.error(`Error fetching price for ${ticker}:`, error);
        }
      }

      if (hasChanged) {
        setUserState(prev => ({ ...prev, realTimePrices: newPrices }));
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate a child request after 45 seconds (shorter than 1-2 mins for demo purposes, but user asked for 1-2 mins)
    // Let's go with 60 seconds as per request "1 ou 2 minutes"
    const timer = setTimeout(() => {
      setPendingChildRequest({
        id: `req_${Date.now()}`,
        childName: "Léo",
        type: Math.random() > 0.5 ? 'debit' : 'credit',
        amount: Math.floor(Math.random() * 50) + 10,
        label: Math.random() > 0.5 ? 'Achat Jeux Vidéo' : 'Argent de poche',
        message: "Salut ! Est-ce que je peux avoir un peu d'argent pour m'acheter le nouveau jeu avec mes copains ? Merci !",
        timestamp: new Date().toLocaleTimeString()
      });
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  const handleApproveRequest = () => {
    if (!pendingChildRequest) return;
    
    setUserState(prev => {
      if (!prev.childAccount) return prev;
      const amount = pendingChildRequest.amount;
      const isDebit = pendingChildRequest.type === 'debit';
      
      return {
        ...prev,
        realBalance: isDebit ? prev.realBalance - amount : prev.realBalance - amount, // Assuming it comes from parent's main account
        childAccount: {
          ...prev.childAccount,
          balance: isDebit ? prev.childAccount.balance - amount : prev.childAccount.balance + amount
        },
        transactions: [
          { 
            id: `tx_${Date.now()}`, 
            date: 'Aujourd\'hui', 
            label: `${isDebit ? 'Débit' : 'Crédit'} approuvé pour ${pendingChildRequest.childName}`, 
            amount: -amount, 
            type: 'transfer' 
          },
          ...prev.transactions
        ]
      };
    });
    setPendingChildRequest(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 relative z-10">
      <AnimatePresence>
        {pendingChildRequest && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <div className="bg-slate-900 border-2 border-blue-500/50 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Demande d'approbation</h3>
                  <p className="text-xs text-slate-400">{pendingChildRequest.timestamp}</p>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-6">
                <p className="text-sm text-slate-300 mb-3">
                  <span className="font-bold text-blue-400">{pendingChildRequest.childName}</span> souhaite effectuer un <span className="font-bold">{pendingChildRequest.type === 'debit' ? 'débit' : 'crédit'}</span> :
                </p>
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800/50">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Motif</p>
                    <span className="text-slate-200 text-sm font-medium">{pendingChildRequest.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Montant</p>
                    <span className="text-xl font-mono font-bold text-white">{pendingChildRequest.amount.toFixed(2)} €</span>
                  </div>
                </div>

                {pendingChildRequest.message && (
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Message de {pendingChildRequest.childName}</p>
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "{pendingChildRequest.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setPendingChildRequest(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Refuser
                </button>
                <button 
                  onClick={handleApproveRequest}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all"
                >
                  Approuver
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="scroll-container" className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <MajorHome 
            name={name} 
            userState={userState} 
            level={level} 
            progressPercent={progressPercent} 
            nextLevelXp={nextLevelXp}
            onGoToProfile={() => setActiveTab('profile')}
            onGoToGamification={() => setActiveTab('gamification')}
          />
        )}
        {activeTab === 'gamification' && (
          <MajorGamification 
            userState={userState} 
            setUserState={setUserState}
            onBack={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'account' && (
          <MajorAccount 
            userState={userState} 
            setUserState={setUserState} 
          />
        )}
        {activeTab === 'gestion' && (
          <MajorGestion 
            userState={userState} 
            setUserState={setUserState} 
            onGoToInvest={() => setActiveTab('invest')}
          />
        )}
        {activeTab === 'insurance' && (
          <MajorInsurance 
            userState={userState} 
            setUserState={setUserState} 
          />
        )}
        {activeTab === 'invest' && (
          <MajorInvest 
            userState={userState} 
            setUserState={setUserState} 
          />
        )}
        {activeTab === 'profile' && (
          <MajorProfile 
            name={name} 
            userState={userState} 
            setUserState={setUserState}
            onLogout={onLogout} 
            onGoToGamification={() => setActiveTab('gamification')}
          />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 px-2 py-4 flex justify-between items-center z-50 max-w-3xl mx-auto">
        <NavItem icon={<Home />} label="Accueil" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<CreditCard />} label="Compte" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
        <NavItem icon={<PieChartIcon />} label="Gestion" active={activeTab === 'gestion'} onClick={() => setActiveTab('gestion')} />
        <NavItem icon={<Shield />} label="Assurances" active={activeTab === 'insurance'} onClick={() => setActiveTab('insurance')} />
        <NavItem icon={<TrendingUp />} label="Investir" active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} />
        <NavItem icon={<User />} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>

      <GenesisAI userContext={{ name, ...userState }} />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}>
      {React.cloneElement(icon, { className: 'w-6 h-6' })}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MajorHome({ name, userState, level, progressPercent, nextLevelXp, onGoToProfile, onGoToGamification }: any) {
  const nextReward = MAJOR_REWARDS.find(r => r.xpRequired > userState.xp) || MAJOR_REWARDS[MAJOR_REWARDS.length - 1];
  const savingsBalance = userState.savingsAccounts.reduce((acc: number, curr: any) => acc + curr.balance, 0);
  const investmentsBalance = userState.investments.reduce((acc: number, curr: any) => acc + curr.balance, 0);
  const totalAssets = userState.realBalance + savingsBalance + investmentsBalance;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Bonjour {name}</h1>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" /> Niveau {level} • Investisseur
            </p>
          </div>
        </div>
      </header>

      {/* Total Assets */}
      <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-sm text-slate-400 mb-1">Patrimoine Global</p>
          <h2 className="text-4xl font-mono font-bold text-white mb-6">{(totalAssets || 0).toFixed(2)} €</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Courant</p>
              <p className="font-mono text-sm font-medium text-slate-300">{(userState.realBalance || 0).toFixed(0)} €</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Épargne</p>
              <p className="font-mono text-sm font-medium text-slate-300">{(savingsBalance || 0).toFixed(0)} €</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Investi</p>
              <p className="font-mono text-sm font-medium text-emerald-400">{(investmentsBalance || 0).toFixed(0)} €</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div>
        <h3 className="font-display text-lg font-bold text-white mb-4">Compléter votre profil</h3>
        
        <div 
          onClick={onGoToProfile}
          className="bg-slate-900/80 border border-slate-700 hover:border-blue-500/50 rounded-3xl p-5 flex items-center gap-4 transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Action requise</span>
            </div>
            <h4 className="font-bold text-base text-white mb-1">Connecter vos comptes</h4>
            <p className="text-xs text-slate-400">
              Rattachez vos banques, assurances et investissements pour une vue 360°.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Progression & Rewards */}
      <div>
        <h3 className="font-display text-lg font-bold text-white mb-4">Vos avantages</h3>
        <div 
          onClick={onGoToGamification}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all group"
        >
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <p className="text-sm text-slate-400 mb-1">Prochain palier</p>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {nextReward.title}
              </h4>
            </div>
            <div className="text-3xl bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              {nextReward.icon}
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-blue-400">{userState.xp} XP</span>
              <span className="text-slate-500">{nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 shadow-inner overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-1000 relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold text-white">Tous les avantages</h3>
        <button onClick={onGoToGamification} className="text-xs text-blue-400 font-bold hover:underline">Voir tout</button>
      </div>
      <div className="space-y-3">
        {MAJOR_REWARDS.slice(0, 2).map((reward, idx) => {
          const isUnlocked = userState.xp >= reward.xpRequired;
          return (
            <div 
              key={idx} 
              onClick={onGoToGamification}
              className={`border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.02] ${isUnlocked ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}
            >
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


function MajorGestion({ userState, setUserState, onGoToInvest }: any) {
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const totalIncome = userState.incomes.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalFixedExpenses = userState.expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const remainingForLiving = totalIncome - totalFixedExpenses;

  // 50/30/20 Rule Targets
  const targetNeeds = totalIncome * 0.50;
  const targetWants = totalIncome * 0.30;
  const targetSavings = totalIncome * 0.20;

  // Current Distribution (Simplified)
  // We assume fixed expenses are "Needs" (50%)
  // The rest is split between Wants and Savings. For the chart, we'll just show the ideal vs actual.
  // Let's build a chart showing: Charges fixes (Besoins), Reste à vivre (Envies + Épargne)
  // Actually, the prompt says: "visualiser, sous forme de graphique camembert la part de reste à charge, ce qu'il peut se permettre d'investir, etc. en respectant la règle des 50/30/20."
  
  const chartData = [
    { name: 'Charges Fixes (Besoins - 50%)', value: totalFixedExpenses, color: '#3b82f6' }, // blue-500
    { name: 'Loisirs & Envies (30%)', value: targetWants, color: '#a855f7' }, // purple-500
    { name: 'Épargne & Investissement (20%)', value: targetSavings, color: '#10b981' }, // emerald-500
  ];

  // If fixed expenses exceed 50%, we adjust the chart to reflect reality
  const actualNeedsPercent = (totalFixedExpenses / totalIncome) * 100 || 0;
  const isOverBudget = actualNeedsPercent > 50;

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncomeName || !newIncomeAmount) return;
    setUserState((prev: any) => ({
      ...prev,
      incomes: [...prev.incomes, { id: Date.now().toString(), name: newIncomeName, amount: parseFloat(newIncomeAmount) }]
    }));
    setNewIncomeName('');
    setNewIncomeAmount('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;
    setUserState((prev: any) => ({
      ...prev,
      expenses: [...prev.expenses, { id: Date.now().toString(), name: newExpenseName, amount: parseFloat(newExpenseAmount) }]
    }));
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const removeIncome = (id: string) => {
    setUserState((prev: any) => ({
      ...prev,
      incomes: prev.incomes.filter((i: any) => i.id !== id)
    }));
  };

  const removeExpense = (id: string) => {
    setUserState((prev: any) => ({
      ...prev,
      expenses: prev.expenses.filter((e: any) => e.id !== id)
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-white">Gestion de Budget</h1>
        <p className="text-slate-400 text-sm font-medium">Visualisez vos finances avec la règle des 50/30/20.</p>
      </header>

      {/* Chart Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4">Répartition Idéale (50/30/20)</h2>
        
        {totalIncome > 0 ? (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} €`, 'Valeur']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Besoins (Charges fixes)</span>
                  <span className="font-mono">{totalFixedExpenses.toFixed(2)} €</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(actualNeedsPercent, 100)}%` }}></div>
                </div>
                {isOverBudget && <p className="text-xs text-red-400 mt-1">Vos charges fixes dépassent les 50% recommandés.</p>}
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Envies (Loisirs)</span>
                  <span className="font-mono">{targetWants.toFixed(2)} €</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Épargne & Invest.</span>
                  <span className="font-mono">{targetSavings.toFixed(2)} €</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              <button 
                onClick={onGoToInvest}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <TrendingUp className="w-5 h-5" /> Investir mon épargne
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Ajoutez des revenus pour générer votre graphique.
          </div>
        )}
      </div>

      {/* Reste à vivre */}
      <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400 mb-1">Reste à vivre (Revenus - Charges)</p>
            <h2 className="text-3xl font-mono font-bold text-white">{remainingForLiving.toFixed(2)} €</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Incomes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Revenus</h3>
            <span className="font-mono text-emerald-400 font-medium">+{totalIncome.toFixed(2)} €</span>
          </div>
          
          <div className="space-y-2">
            {userState.incomes.map((income: any) => (
              <div key={income.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-slate-300">{income.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-white">{income.amount.toFixed(2)} €</span>
                  <button onClick={() => removeIncome(income.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddIncome} className="flex gap-2 w-full">
            <input 
              type="text" 
              placeholder="Nom (ex: Salaire)" 
              value={newIncomeName}
              onChange={(e) => setNewIncomeName(e.target.value)}
              className="flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <input 
              type="number" 
              placeholder="Montant" 
              value={newIncomeAmount}
              onChange={(e) => setNewIncomeAmount(e.target.value)}
              className="w-20 sm:w-24 shrink-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button type="submit" className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </section>

        {/* Expenses */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Charges Fixes</h3>
            <span className="font-mono text-blue-400 font-medium">-{totalFixedExpenses.toFixed(2)} €</span>
          </div>
          
          <div className="space-y-2">
            {userState.expenses.map((expense: any) => (
              <div key={expense.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm text-slate-300">{expense.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-medium text-white">{expense.amount.toFixed(2)} €</span>
                  <button onClick={() => removeExpense(expense.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddExpense} className="flex gap-2 w-full">
            <input 
              type="text" 
              placeholder="Nom (ex: Loyer)" 
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className="flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
            <input 
              type="number" 
              placeholder="Montant" 
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-20 sm:w-24 shrink-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </section>
      </div>
    </motion.div>
  );
}

function MajorAccount({ userState, setUserState }: any) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRIBModal, setShowRIBModal] = useState(false);
  const [showOpenSavingsModal, setShowOpenSavingsModal] = useState(false);
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);
  const [selectedSavingsAccountId, setSelectedSavingsAccountId] = useState<string | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const setCardType = (type: 'virtuelle' | 'physique') => {
    setUserState((prev: any) => ({ ...prev, cardType: type }));
  };

  const [initialToId, setInitialToId] = useState('');

  const handleTransfer = (amount: number, fromId: string, toId: string) => {
    setUserState((prev: any) => {
      const newState = { ...prev };
      const date = "Aujourd'hui";
      const txId = `tx_${Date.now()}`;
      
      // Deep copy childAccount if it exists
      if (prev.childAccount) {
        newState.childAccount = { ...prev.childAccount };
      }

      const getAccountName = (id: string) => {
        if (id === 'main') return 'Compte Courant';
        if (id === 'child') return `Compte de ${prev.childAccount?.name}`;
        const savings = prev.savingsAccounts.find((a: any) => a.id === id);
        if (savings) return savings.name;
        const beneficiary = prev.beneficiaries.find((b: any) => b.id === id);
        if (beneficiary) return beneficiary.name;
        return 'Inconnu';
      };

      const fromName = getAccountName(fromId);
      const toName = getAccountName(toId);

      // Helper to update balances and histories
      const updateAccount = (id: string, delta: number, label: string) => {
        if (id === 'main') {
          newState.realBalance = Number((newState.realBalance + delta).toFixed(2));
          newState.transactions = [
            { id: txId, date, label, amount: delta, type: 'transfer' },
            ...newState.transactions
          ];
        } else if (id === 'child') {
          if (newState.childAccount) {
            newState.childAccount.balance = Number((newState.childAccount.balance + delta).toFixed(2));
          }
        } else if (id.startsWith('sav_') || prev.savingsAccounts.some((a: any) => a.id === id)) {
          newState.savingsAccounts = newState.savingsAccounts.map((acc: any) => {
            if (acc.id === id) {
              return {
                ...acc,
                balance: Number((acc.balance + delta).toFixed(2)),
                transactions: [
                  { id: txId, date, label, amount: delta, type: 'transfer' },
                  ...(acc.transactions || [])
                ]
              };
            }
            return acc;
          });
        }
        // Beneficiaries don't have a balance in our app, so we just don't update anything for them
      };

      updateAccount(fromId, -amount, `Virement vers ${toName}`);
      
      // Only update destination if it's an internal account
      const isInternal = toId === 'main' || toId === 'child' || toId.startsWith('sav_') || prev.savingsAccounts.some((a: any) => a.id === toId);
      if (isInternal) {
        updateAccount(toId, amount, `Virement depuis ${fromName}`);
      }

      return newState;
    });
    setShowTransferModal(false);
    setInitialToId('');
  };

  const handleOpenSavings = (name: string) => {
    const newAccount = {
      id: `sav_${Date.now()}`,
      name,
      balance: 0,
      rate: 3.0,
      ceiling: 10000
    };
    setUserState((prev: any) => ({
      ...prev,
      savingsAccounts: [...prev.savingsAccounts, newAccount]
    }));
    setShowOpenSavingsModal(false);
  };

  const handleAddBeneficiary = (name: string, iban: string, bank: string) => {
    const newBeneficiary = {
      id: `b_${Date.now()}`,
      name,
      iban,
      bank: bank || 'Autre Banque'
    };
    setUserState((prev: any) => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, newBeneficiary]
    }));
    setShowAddBeneficiaryModal(false);
  };

  if (showAllTransactions) {
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
        <header className="flex items-center gap-4 pt-2">
          <button onClick={() => setShowAllTransactions(false)} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-white">Historique Complet</h1>
        </header>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2 shadow-lg">
          {userState.transactions.map((tx: any, idx: number) => (
            <div key={tx.id} className={`flex items-center justify-between p-4 ${idx !== userState.transactions.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10' : tx.type === 'transfer' ? 'bg-blue-500/10' : 'bg-slate-800'}`}>
                  {tx.type === 'income' ? <ArrowDownRight className="w-5 h-5 text-emerald-400" /> : tx.type === 'transfer' ? <ArrowRightLeft className="w-5 h-5 text-blue-400" /> : <ArrowUpRight className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-200">{tx.label}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
              <span className={`font-mono font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const selectedSavingsAccount = userState.savingsAccounts.find(acc => acc.id === selectedSavingsAccountId);

  if (selectedSavingsAccountId && selectedSavingsAccount) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
        <header className="flex items-center gap-4 pt-2">
          <button onClick={() => setSelectedSavingsAccountId(null)} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-white">{selectedSavingsAccount.name}</h1>
        </header>

        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <p className="text-sm text-slate-400 mb-1">Solde disponible</p>
          <h2 className="text-5xl font-mono font-bold text-white mb-6">{selectedSavingsAccount.balance.toFixed(2)} €</h2>
          <div className="flex gap-4">
            <button onClick={() => setShowTransferModal(true)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all">
              Déposer / Retirer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-500 uppercase mb-1 tracking-wider">Taux d'intérêt</p>
            <p className="text-xl font-bold text-emerald-400">{selectedSavingsAccount.rate}% <span className="text-xs font-normal text-slate-500">brut/an</span></p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-slate-500 uppercase mb-1 tracking-wider">Plafond</p>
            <p className="text-xl font-bold text-white">{selectedSavingsAccount.ceiling} €</p>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Relevés récents</h3>
          {(!selectedSavingsAccount.transactions || selectedSavingsAccount.transactions.length === 0) ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 text-center text-slate-500 text-sm">
              Aucune opération récente sur ce livret.
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2 shadow-lg">
              {selectedSavingsAccount.transactions.map((tx: any, idx: number) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 ${idx !== selectedSavingsAccount.transactions!.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-200">{tx.label}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-mono font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <TransferModal 
          isOpen={showTransferModal} 
          onClose={() => setShowTransferModal(false)} 
          onTransfer={handleTransfer}
          userState={userState}
          initialFromId={selectedSavingsAccount.id}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-white">Mes Comptes</h1>
        <p className="text-slate-400 text-sm font-medium">Gérez votre argent au quotidien et votre épargne de précaution.</p>
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
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/20">Principal</span>
          </div>
          <p className="text-4xl font-mono font-bold text-white mb-6">{(userState.realBalance || 0).toFixed(2)} €</p>
          
          <div className="flex gap-3">
            <button onClick={() => setShowTransferModal(true)} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
              Virement
            </button>
            <button onClick={() => setShowRIBModal(true)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
              RIB / IBAN
            </button>
          </div>
        </div>
      </div>

      {/* Mes Bénéficiaires */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold text-white">Mes Bénéficiaires</h3>
          <button 
            onClick={() => setShowAddBeneficiaryModal(true)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Ajouter
          </button>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2 shadow-lg">
          {userState.beneficiaries.map((beneficiary: any, idx: number) => (
            <div key={beneficiary.id} className={`flex items-center justify-between p-4 ${idx !== userState.beneficiaries.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-200">{beneficiary.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{beneficiary.iban}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setInitialToId(beneficiary.id);
                  setShowTransferModal(true);
                }}
                className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carte Bancaire */}
      <div>
        <h3 className="font-display text-lg font-bold text-white mb-4">Ma Carte Bancaire</h3>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-lg">
          {!userState.cardType ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-300 mb-6">Vous n'avez pas encore de carte bancaire active.</p>
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
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              
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
                  **** **** **** 4092
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Titulaire</div>
                    <div className="text-sm font-medium text-slate-300 uppercase">{userState.name || 'Utilisateur'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Type</div>
                    <div className="text-xs font-medium text-blue-400">{userState.cardType === 'virtuelle' ? 'Virtuelle' : 'Physique'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Livrets d'épargne */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold text-white">Mes Livrets d'Épargne</h3>
          <button onClick={() => setShowOpenSavingsModal(true)} className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
            <Plus className="w-3 h-3" /> Ouvrir un livret
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {userState.savingsAccounts.map((account: any) => (
            <div 
              key={account.id} 
              onClick={() => setSelectedSavingsAccountId(account.id)}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white">{account.name}</h4>
                  <p className="text-xs text-emerald-400 font-medium">Taux: {account.rate}%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <p className="text-2xl font-mono font-bold text-white mb-3">{(account.balance || 0).toFixed(2)} €</p>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Plafond: {account.ceiling} €</span>
                  <span>{((account.balance / account.ceiling) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((account.balance / account.ceiling) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dernières Opérations */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold text-white">Dernières Opérations</h3>
          <button onClick={() => setShowAllTransactions(true)} className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1">
            <History className="w-3 h-3" /> Voir tout
          </button>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2 shadow-lg">
          {userState.transactions.slice(0, 5).map((tx: any, idx: number) => (
            <div key={tx.id} className={`flex items-center justify-between p-4 ${idx !== Math.min(userState.transactions.length, 5) - 1 ? 'border-b border-slate-800/50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10' : tx.type === 'transfer' ? 'bg-blue-500/10' : 'bg-slate-800'}`}>
                  {tx.type === 'income' ? <ArrowDownRight className="w-5 h-5 text-emerald-400" /> : tx.type === 'transfer' ? <ArrowRightLeft className="w-5 h-5 text-blue-400" /> : <ArrowUpRight className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-200">{tx.label}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
              <span className={`font-mono font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      </div>

      <TransferModal 
        isOpen={showTransferModal} 
        onClose={() => {
          setShowTransferModal(false);
          setInitialToId('');
        }} 
        onTransfer={handleTransfer}
        userState={userState}
        initialToId={initialToId}
      />

      <RIBModal 
        isOpen={showRIBModal} 
        onClose={() => setShowRIBModal(false)} 
        name={userState.name}
      />

      <OpenSavingsModal 
        isOpen={showOpenSavingsModal} 
        onClose={() => setShowOpenSavingsModal(false)} 
        onOpen={handleOpenSavings}
      />

      <AddBeneficiaryModal
        isOpen={showAddBeneficiaryModal}
        onClose={() => setShowAddBeneficiaryModal(false)}
        onAdd={handleAddBeneficiary}
      />
    </motion.div>
  );
}

function TransferModal({ isOpen, onClose, onTransfer, userState, initialFromId = 'main', initialToId = '' }: any) {
  const [amount, setAmount] = useState('');
  const [fromId, setFromId] = useState(initialFromId);
  const [toId, setToId] = useState(initialToId);

  // Update toId if initialToId changes
  useEffect(() => {
    if (initialToId) {
      setToId(initialToId);
    }
  }, [initialToId]);

  const accounts = [
    { id: 'main', name: 'Compte Courant', balance: userState.realBalance },
    ...userState.savingsAccounts.map((a: any) => ({ id: a.id, name: a.name, balance: a.balance })),
    ...(userState.childAccount?.linked ? [{ id: 'child', name: `Compte de ${userState.childAccount.name}`, balance: userState.childAccount.balance }] : [])
  ];

  const beneficiaries = userState.beneficiaries;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !fromId || !toId || fromId === toId) return;
    onTransfer(parseFloat(amount), fromId, toId);
    setAmount('');
    setToId('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Nouveau Virement</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Depuis</label>
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.balance.toFixed(2)} €)</option>)}
                </select>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-slate-400 rotate-90" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Vers</label>
                <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                  <option value="">Sélectionner un destinataire</option>
                  <optgroup label="Mes Comptes" className="bg-slate-900 text-slate-400">
                    {accounts.filter(acc => acc.id !== fromId).map(acc => (
                      <option key={acc.id} value={acc.id} className="text-white">{acc.name} ({acc.balance.toFixed(2)} €)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Mes Bénéficiaires" className="bg-slate-900 text-slate-400">
                    {beneficiaries.map((b: any) => (
                      <option key={b.id} value={b.id} className="text-white">{b.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Montant</label>
                <div className="relative">
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-2xl font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xl">€</span>
                </div>
              </div>

              <button type="submit" disabled={!amount || !toId || parseFloat(amount) <= 0} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50">
                Confirmer le virement
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RIBModal({ isOpen, onClose, name }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white text-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <GenesisLogo className="w-8 h-8" />
                <span className="font-display font-bold text-xl tracking-wide text-slate-900">GENESIS</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-slate-200 pb-2">Relevé d'Identité Bancaire</h3>
              
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Titulaire du compte</p>
                <p className="font-medium">{name || 'Utilisateur Genesis'}</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Code Banque</p>
                  <p className="font-mono text-sm">17515</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Code Guichet</p>
                  <p className="font-mono text-sm">90000</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">N° Compte</p>
                  <p className="font-mono text-sm">00001234567</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">IBAN</p>
                <p className="font-mono text-sm break-all">FR76 1751 5900 0000 0012 3456 789</p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">BIC / SWIFT</p>
                <p className="font-mono text-sm">GENEFR2PXXX</p>
              </div>

              <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Télécharger le RIB
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LimitsModal({ isOpen, onClose, childAccount, onUpdateLimits }: any) {
  const [paymentLimit, setPaymentLimit] = useState(childAccount?.limits?.payment || 200);
  const [withdrawalLimit, setWithdrawalLimit] = useState(childAccount?.limits?.withdrawal || 50);
  const [onlinePurchase, setOnlinePurchase] = useState(childAccount?.limits?.onlinePurchase ?? true);
  const [atmWithdrawal, setAtmWithdrawal] = useState(childAccount?.limits?.atmWithdrawal ?? false);

  if (!childAccount) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Limites de {childAccount.name}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-400">Plafond de paiement (30j)</label>
                  <span className="text-blue-400 font-mono font-bold">{paymentLimit} €</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="50"
                  value={paymentLimit} 
                  onChange={(e) => setPaymentLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-400">Plafond de retrait (30j)</label>
                  <span className="text-blue-400 font-mono font-bold">{withdrawalLimit} €</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="10"
                  value={withdrawalLimit} 
                  onChange={(e) => setWithdrawalLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Achat en ligne</p>
                    <p className="text-[10px] text-slate-500">Autoriser les paiements sur internet</p>
                  </div>
                  <button 
                    onClick={() => setOnlinePurchase(!onlinePurchase)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${onlinePurchase ? 'bg-emerald-600' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${onlinePurchase ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Retrait DAB</p>
                    <p className="text-[10px] text-slate-500">Autoriser les retraits aux distributeurs</p>
                  </div>
                  <button 
                    onClick={() => setAtmWithdrawal(!atmWithdrawal)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${atmWithdrawal ? 'bg-emerald-600' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${atmWithdrawal ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-xs text-slate-400">Ces limites s'appliquent uniquement à la carte bancaire de l'enfant. Les virements entre vos comptes restent illimités.</p>
              </div>

              <button 
                onClick={() => onUpdateLimits({ payment: paymentLimit, withdrawal: withdrawalLimit, onlinePurchase, atmWithdrawal })}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
              >
                Enregistrer les modifications
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OpenSavingsModal({ isOpen, onClose, onOpen }: any) {
  const [name, setName] = useState('');
  const options = ["Livret Jeune", "Livret d'Épargne Populaire (LEP)", "Compte Épargne Logement (CEL)", "Plan Épargne Logement (PEL)"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Ouvrir un Livret</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-400">Choisissez le type de livret que vous souhaitez ouvrir :</p>
              <div className="grid gap-2">
                {options.map(opt => (
                  <button 
                    key={opt} 
                    onClick={() => onOpen(opt)}
                    className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-left text-sm font-medium text-white hover:border-blue-500 transition-all flex justify-between items-center group"
                  >
                    {opt}
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AddBeneficiaryModal({ isOpen, onClose, onAdd }: any) {
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [bank, setBank] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && iban) {
      onAdd(name, iban, bank);
      setName('');
      setIban('');
      setBank('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Ajouter un Bénéficiaire</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nom complet</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="ex: Jean Dupont" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">IBAN</label>
                <input 
                  type="text" 
                  value={iban} 
                  onChange={(e) => setIban(e.target.value)} 
                  placeholder="FR76 ..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Banque (optionnel)</label>
                <input 
                  type="text" 
                  value={bank} 
                  onChange={(e) => setBank(e.target.value)} 
                  placeholder="ex: BNP Paribas" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={!name || !iban}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 mt-4"
              >
                Ajouter le bénéficiaire
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
  
const ASSETS_TO_BUY = [
  { ticker: 'CW8.PA', name: 'Amundi MSCI World', price: 400.50, type: 'ETF', risk: 4 },
  { ticker: 'PAASI.PA', name: 'Amundi MSCI Emerging Markets', price: 23.40, type: 'ETF', risk: 5 },
  { ticker: 'PUST.PA', name: 'Lyxor S&P 500', price: 35.20, type: 'ETF', risk: 4 },
  { ticker: 'AI.PA', name: 'Air Liquide', price: 175.00, type: 'Action', risk: 3 },
  { ticker: 'OR.PA', name: 'L\'Oréal', price: 420.00, type: 'Action', risk: 3 },
  { ticker: 'LYXB.PA', name: 'Lyxor Euro Gov Bond', price: 145.00, type: 'Obligation', risk: 2 },
  { ticker: 'GC=F', name: 'Or Physique (Once)', price: 1950.00, type: 'Métal', risk: 3 },
  { ticker: 'SI=F', name: 'Argent Physique', price: 22.50, type: 'Métal', risk: 4 },
  { ticker: 'BTC-USD', name: 'Bitcoin', price: 65000.00, type: 'Crypto', risk: 5 },
  { ticker: 'ETH-USD', name: 'Ethereum', price: 3500.00, type: 'Crypto', risk: 5 },
];

const MOCK_CHART_DATA = [
  { date: 'Jan', value: 750 },
  { date: 'Fév', value: 780 },
  { date: 'Mar', value: 760 },
  { date: 'Avr', value: 800 },
  { date: 'Mai', value: 820 },
  { date: 'Juin', value: 800 },
];

function MajorInvest({ userState, setUserState }: any) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [showExchangeSimulator, setShowExchangeSimulator] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellAmount, setSellAmount] = useState('');
  const [exchangeAmount, setExchangeAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [selectedHolding, setSelectedHolding] = useState<any>(null);
  const [historyRange, setHistoryRange] = useState('1m');
  const [displayMode, setDisplayMode] = useState<'absolute' | 'percentage'>('absolute');
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (selectedHolding) {
      fetchHistory(selectedHolding.ticker, historyRange);
    }
  }, [selectedHolding, historyRange]);

  const fetchHistory = async (symbol: string, range: string) => {
    setIsLoadingHistory(true);
    setHistoricalData([]); // Clear previous data to show loading
    try {
      const response = await fetch(`/api/stock/${symbol}/history?range=${range}`);
      if (response.ok) {
        const data = await response.json();
        setHistoricalData(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const exchangeRates: Record<string, number> = {
    'EUR_USD': 1.09,
    'USD_EUR': 0.92,
    'EUR_GBP': 0.86,
    'GBP_EUR': 1.16,
    'EUR_JPY': 162.50,
    'JPY_EUR': 0.0062,
    'USD_JPY': 149.20,
    'JPY_USD': 0.0067,
  };

  const currencies = ['EUR', 'USD', 'GBP', 'JPY'];

  const getExchangeResult = () => {
    const amount = parseFloat(exchangeAmount) || 0;
    if (fromCurrency === toCurrency) return amount;
    const rate = exchangeRates[`${fromCurrency}_${toCurrency}`] || 1;
    return amount * rate;
  };

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(buyAmount);
    if (!amount || amount <= 0 || !selectedAsset || !selectedAccount) return;
    
    const rtData = userState.realTimePrices[selectedAsset.ticker];
    const currentPrice = rtData?.price || selectedAsset.price;

    if (amount > userState.realBalance) {
      alert("Solde insuffisant sur le compte courant.");
      return;
    }

    const shares = amount / currentPrice;

    setUserState((prev: any) => {
      // Update real balance
      const newRealBalance = prev.realBalance - amount;

      // Update investment balance
      const updatedInvestments = prev.investments.map((inv: any) => {
        if (inv.id === selectedAccount) {
          return { ...inv, balance: inv.balance + amount };
        }
        return inv;
      });

      // Add transaction
      const newTransaction = {
        id: `it_${Date.now()}`,
        accountId: selectedAccount,
        date: 'Aujourd\'hui',
        label: `Achat ${selectedAsset.ticker}`,
        amount: -amount,
        type: 'buy'
      };

      // Add or update holding
      const existingHoldingIndex = prev.holdings.findIndex((h: any) => h.accountId === selectedAccount && h.ticker === selectedAsset.ticker);
      let newHoldings = [...prev.holdings];
      
      if (existingHoldingIndex >= 0) {
        const h = newHoldings[existingHoldingIndex];
        newHoldings[existingHoldingIndex] = {
          ...h,
          shares: h.shares + shares,
          value: h.value + amount
        };
      } else {
        newHoldings.push({
          id: `h_${Date.now()}`,
          accountId: selectedAccount,
          name: selectedAsset.name,
          ticker: selectedAsset.ticker,
          shares: shares,
          value: amount,
          performance: 0
        });
      }

      return {
        ...prev,
        realBalance: newRealBalance,
        investments: updatedInvestments,
        investTransactions: [newTransaction, ...prev.investTransactions],
        holdings: newHoldings
      };
    });

    setShowBuyModal(false);
    setBuyAmount('');
    setSelectedAsset(null);
    setSelectedHolding(null);
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sellAmount);
    if (!amount || amount <= 0 || !selectedHolding) return;
    
    const rtData = userState.realTimePrices[selectedHolding.ticker];
    const currentPrice = rtData?.price || (selectedHolding.value / selectedHolding.shares);
    const currentMarketValue = selectedHolding.shares * currentPrice;

    if (amount > currentMarketValue + 0.01) {
      alert("Montant supérieur à la valeur de la position.");
      return;
    }

    // If the amount is very close to the total market value, assume they want to sell everything
    const isSellingAll = Math.abs(amount - currentMarketValue) < 0.05;
    const sharesToSell = isSellingAll ? selectedHolding.shares : Math.min(amount / currentPrice, selectedHolding.shares);

    setUserState((prev: any) => {
      // Update real balance
      const newRealBalance = prev.realBalance + amount;

      // Update investment balance
      const updatedInvestments = prev.investments.map((inv: any) => {
        if (inv.id === selectedHolding.accountId) {
          return { ...inv, balance: inv.balance - amount };
        }
        return inv;
      });

      // Add transaction
      const newTransaction = {
        id: `it_${Date.now()}`,
        accountId: selectedHolding.accountId,
        date: 'Aujourd\'hui',
        label: `Vente ${selectedHolding.ticker}`,
        amount: amount,
        type: 'sell'
      };

      // Update holding
      let newHoldings = prev.holdings.map((h: any) => {
        if (h.id === selectedHolding.id) {
          const newShares = isSellingAll ? 0 : h.shares - sharesToSell;
          const newValue = isSellingAll ? 0 : h.value * (newShares / h.shares);
          if (newShares <= 0.0001) return null; // Remove if empty
          return { ...h, shares: newShares, value: newValue };
        }
        return h;
      }).filter(Boolean);

      return {
        ...prev,
        realBalance: newRealBalance,
        investments: updatedInvestments,
        investTransactions: [newTransaction, ...prev.investTransactions],
        holdings: newHoldings
      };
    });

    setShowSellModal(false);
    setSellAmount('');
    setSelectedHolding(null);
  };

  const activateAccount = (id: string) => {
    setUserState((prev: any) => ({
      ...prev,
      investments: prev.investments.map((inv: any) => inv.id === id ? { ...inv, active: true } : inv)
    }));
  };

  if (selectedAccount) {
    const account = userState.investments.find((i: any) => i.id === selectedAccount);
    const holdings = userState.holdings.filter((h: any) => h.accountId === selectedAccount);
    const transactions = userState.investTransactions.filter((t: any) => t.accountId === selectedAccount);

    // Calculate real-time global performance for this account
    const totalCurrentValue = holdings.reduce((acc: number, h: any) => {
      const rtData = userState.realTimePrices[h.ticker];
      return acc + (rtData ? h.shares * rtData.price : h.value);
    }, 0);
    
    const totalInvested = holdings.reduce((acc: number, h: any) => acc + h.value, 0);
    const globalPerf = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    // Helper for mini charts
    const generateSparklineData = (price: number, perf: number) => {
      const points = 10;
      const data = [];
      let current = price / (1 + perf / 100);
      const step = (price - current) / points;
      for (let i = 0; i <= points; i++) {
        data.push({ value: current + step * i + (Math.random() - 0.5) * (price * 0.01) });
      }
      return data;
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
        <header className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedAccount(null)} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{account.name}</h1>
              <p className="text-slate-400 text-sm font-medium">Portefeuille d'investissement</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Disponible</p>
            <p className="text-white font-mono font-bold">{userState.realBalance.toFixed(2)} €</p>
          </div>
        </header>

        {/* Global Performance Card - Trade Republic Style */}
        <div className="bg-black border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <p className="text-slate-400 text-sm mb-1">Valeur totale</p>
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-5xl font-mono font-bold text-white">{(totalCurrentValue || account.balance).toFixed(2)} €</h2>
            </div>
            <div className={`flex items-center gap-2 font-medium ${globalPerf >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className="text-lg">{globalPerf >= 0 ? '+' : ''}{globalPerf.toFixed(2)} €</span>
              <span className="text-sm opacity-80">({globalPerf >= 0 ? '+' : ''}{globalPerf.toFixed(2)}%)</span>
              <span className="text-xs text-slate-500 ml-2">Aujourd'hui</span>
            </div>
          </div>

          <div className="h-40 w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={globalPerf >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={globalPerf >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} €`, 'Valeur']}
                  contentStyle={{ backgroundColor: '#000', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={globalPerf >= 0 ? "#10b981" : "#ef4444"} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorGlobal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button onClick={() => setShowBuyModal(true)} className="flex-1 bg-white text-black hover:bg-slate-200 font-bold py-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" /> Investir
            </button>
            <button className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-white hover:bg-slate-800 transition-colors">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Holdings List - Trade Republic Style */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl font-bold text-white">Positions</h3>
            <button className="text-purple-400 text-sm font-bold hover:text-purple-300">Tout voir</button>
          </div>
          
          {holdings.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">Commencez à bâtir votre patrimoine</p>
              <button onClick={() => setShowBuyModal(true)} className="mt-4 text-purple-400 font-bold">Acheter votre premier actif</button>
            </div>
          ) : (
            <div className="space-y-1">
              {holdings.map((h: any) => {
                const rtData = userState.realTimePrices[h.ticker];
                const currentValue = rtData ? h.shares * rtData.price : h.value;
                const perf = rtData ? ((rtData.price - (h.value / h.shares)) / (h.value / h.shares)) * 100 : h.performance;
                const sparkData = generateSparklineData(rtData?.price || (h.value / h.shares), perf);

                return (
                  <motion.div 
                    key={h.id} 
                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                    onClick={() => setSelectedHolding(h)}
                    className="group px-4 py-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all border border-transparent hover:border-slate-800"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-xs group-hover:scale-110 transition-transform">
                        {h.ticker.substring(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-lg">{h.ticker}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium truncate max-w-[120px]">{h.name}</p>
                      </div>
                    </div>

                    {/* Mini Sparkline */}
                    <div className="w-24 h-12 mx-4 hidden sm:block">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparkData}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={perf >= 0 ? "#10b981" : "#ef4444"} 
                            strokeWidth={2} 
                            dot={false} 
                            animationDuration={1500}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-white text-lg">{currentValue.toFixed(2)} €</p>
                      <div className={`flex items-center justify-end gap-1 text-sm font-bold ${perf >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {perf >= 0 ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {perf >= 0 ? '+' : ''}{perf.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Historique</h3>
          {transactions.length === 0 ? (
            <div className="text-center py-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
              <p className="text-slate-400 text-sm">Aucune transaction.</p>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2">
              {transactions.map((tx: any, idx: number) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 ${idx !== transactions.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                      {tx.type === 'buy' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-200">{tx.label}</p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-white">
                    {tx.amount.toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buy Modal */}
        <AnimatePresence>
          {showBuyModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-display text-2xl font-bold text-white">Investir</h3>
                  <button onClick={() => setShowBuyModal(false)} className="text-slate-500 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {!selectedAsset ? (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-sm text-slate-400 mb-4">Choisissez un actif à acheter :</p>
                    <div className="grid grid-cols-1 gap-3">
                      {ASSETS_TO_BUY.map((asset) => {
                        const rt = userState.realTimePrices[asset.ticker];
                        return (
                          <div 
                            key={asset.ticker}
                            onClick={() => setSelectedAsset(asset)}
                            className="p-4 bg-slate-800/30 border border-slate-800 rounded-2xl hover:border-purple-500/50 cursor-pointer transition-all flex justify-between items-center group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:text-purple-400">
                                {asset.ticker.substring(0, 3)}
                              </div>
                              <div>
                                <p className="font-bold text-white">{asset.ticker}</p>
                                <p className="text-[10px] text-slate-500 uppercase">{asset.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold text-white">{(rt?.price || asset.price).toFixed(2)} €</p>
                              <p className={`text-[10px] font-bold ${rt?.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {rt?.change >= 0 ? '+' : ''}{rt?.change?.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => setShowBuyModal(false)} className="w-full py-3 text-slate-400 hover:text-white font-medium transition-colors">
                      Annuler
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBuy} className="space-y-6">
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{selectedAsset.ticker}</p>
                        <p className="text-xs text-slate-400">{selectedAsset.name}</p>
                      </div>
                      <button type="button" onClick={() => setSelectedAsset(null)} className="text-xs text-purple-400 hover:text-purple-300">Changer</button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Montant à investir (Solde: {userState.realBalance.toFixed(2)} €)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          max={userState.realBalance}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-2xl font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                          autoFocus
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xl">€</span>
                      </div>
                      {buyAmount && parseFloat(buyAmount) > 0 && (
                        <p className="text-xs text-slate-500 mt-2 text-right">
                          Soit environ {(parseFloat(buyAmount) / (userState.realTimePrices[selectedAsset.ticker]?.price || selectedAsset.price)).toFixed(4)} parts
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowBuyModal(false)} className="flex-1 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors">
                        Annuler
                      </button>
                      <button type="submit" disabled={!buyAmount || parseFloat(buyAmount) <= 0 || parseFloat(buyAmount) > userState.realBalance} className="flex-1 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Confirmer l'achat
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Holding View Modal */}
        <AnimatePresence>
          {selectedHolding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-slate-950 border-t sm:border border-slate-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-6 sm:p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-lg">
                        {selectedHolding.ticker.substring(0, 3)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{selectedHolding.ticker}</h3>
                        <p className="text-slate-400 font-medium">{selectedHolding.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedHolding(null)} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Price & Perf */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h4 className="text-5xl font-mono font-bold text-white">
                        {displayMode === 'absolute' 
                          ? `${(userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)).toFixed(2)} €`
                          : `${((userState.realTimePrices[selectedHolding.ticker]?.price / (selectedHolding.value / selectedHolding.shares) - 1) * 100).toFixed(2)} %`
                        }
                      </h4>
                      <button 
                        onClick={() => setDisplayMode(prev => prev === 'absolute' ? 'percentage' : 'absolute')}
                        className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded hover:bg-slate-700 transition-colors"
                      >
                        {displayMode === 'absolute' ? '%' : '€'}
                      </button>
                    </div>
                    <div className={`flex items-center gap-2 font-bold ${((userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)) >= (selectedHolding.value / selectedHolding.shares)) ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span>
                        {displayMode === 'absolute' 
                          ? `${((userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)) - (selectedHolding.value / selectedHolding.shares)).toFixed(2)} €`
                          : `${((userState.realTimePrices[selectedHolding.ticker]?.price / (selectedHolding.value / selectedHolding.shares) - 1) * 100).toFixed(2)} %`
                        }
                      </span>
                      <span className="text-xs opacity-60 uppercase tracking-widest">Depuis l'achat</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-64 w-full mb-8 relative">
                    {isLoadingHistory && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 backdrop-blur-[2px]">
                        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                      </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData.length > 0 ? historicalData : MOCK_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          hide={false}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#475569', fontSize: 10 }}
                          tickFormatter={(tick) => {
                            const date = new Date(tick);
                            if (isNaN(date.getTime())) return tick; // Handle mock data strings
                            if (historyRange === '1h' || historyRange === '1j') {
                              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                            return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
                          }}
                          minTickGap={30}
                        />
                        <YAxis 
                          hide={true} 
                          domain={['auto', 'auto']}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)} €`, 'Valeur']}
                          contentStyle={{ backgroundColor: '#000', borderColor: '#334155', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                          labelFormatter={(label) => {
                            if (typeof label === 'number' || !isNaN(new Date(label).getTime())) {
                              return new Date(label).toLocaleString();
                            }
                            return label;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorHistory)" 
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Time Filters */}
                  <div className="flex justify-between bg-slate-900 p-1 rounded-2xl mb-8">
                    {[
                      { label: '1h', value: '1h' },
                      { label: '1j', value: '1j' },
                      { label: '1s', value: '1s' },
                      { label: '1m', value: '1m' },
                      { label: '1a', value: '1a' },
                      { label: 'Max', value: 'all' },
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setHistoryRange(filter.value)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${historyRange === filter.value ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Position Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Parts détenues</p>
                      <p className="text-white font-mono font-bold">{selectedHolding.shares.toFixed(4)}</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Prix de revient</p>
                      <p className="text-white font-mono font-bold">{(selectedHolding.value / selectedHolding.shares).toFixed(2)} €</p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Valeur actuelle</p>
                      <p className="text-white font-mono font-bold">
                        {(selectedHolding.shares * (userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares))).toFixed(2)} €
                      </p>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Plus-value</p>
                      <p className={`font-mono font-bold ${((userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)) >= (selectedHolding.value / selectedHolding.shares)) ? 'text-emerald-400' : 'text-red-400'}`}>
                        {((userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)) * selectedHolding.shares - selectedHolding.value).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-slate-900/50 border-t border-slate-800 flex gap-4">
                  <button 
                    onClick={() => {
                      const asset = ASSETS_TO_BUY.find(a => a.ticker === selectedHolding.ticker);
                      if (asset) {
                        setSelectedAsset(asset);
                        setSelectedAccount(selectedHolding.accountId);
                        setShowBuyModal(true);
                      }
                    }}
                    className="flex-1 bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Acheter plus
                  </button>
                  <button 
                    onClick={() => setShowSellModal(true)}
                    className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-colors"
                  >
                    Vendre
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {showSellModal && selectedHolding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white">Vendre {selectedHolding.ticker}</h3>
                    <button onClick={() => setShowSellModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSell} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Montant à vendre (€)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={sellAmount} 
                          onChange={(e) => setSellAmount(e.target.value)} 
                          placeholder="0.00" 
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-2xl font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-slate-500">
                          Valeur dispo: <span className="text-white font-bold">{(selectedHolding.shares * (userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares))).toFixed(2)} €</span>
                        </p>
                        <button 
                          type="button"
                          onClick={() => setSellAmount((selectedHolding.shares * (userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares))).toFixed(2))}
                          className="text-xs text-purple-400 font-bold hover:text-purple-300"
                        >
                          Tout vendre
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Parts à vendre</span>
                        <span className="text-white font-mono">
                          {(parseFloat(sellAmount) / (userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)) || 0).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Prix actuel</span>
                        <span className="text-white font-mono">
                          {(userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares)).toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!sellAmount || parseFloat(sellAmount) <= 0 || parseFloat(sellAmount) > (selectedHolding.shares * (userState.realTimePrices[selectedHolding.ticker]?.price || (selectedHolding.value / selectedHolding.shares))) + 0.01}
                      className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-900/20"
                    >
                      Confirmer la vente
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Calculate global stats for all active investment accounts
  const allActiveHoldings = userState.holdings;
  const totalInvestedAll = allActiveHoldings.reduce((acc: number, h: any) => acc + h.value, 0);
  const totalCurrentValueAll = allActiveHoldings.reduce((acc: number, h: any) => {
    const rtData = userState.realTimePrices[h.ticker];
    return acc + (rtData ? h.shares * rtData.price : h.value);
  }, 0);
  const globalPerfAll = totalInvestedAll > 0 ? ((totalCurrentValueAll - totalInvestedAll) / totalInvestedAll) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="pt-2 flex justify-between items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Investissements</h1>
          <p className="text-slate-400 text-sm font-medium">Faites fructifier votre capital à moyen et long terme.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Performance Totale</p>
          <p className={`text-lg font-mono font-bold ${globalPerfAll >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {globalPerfAll >= 0 ? '+' : ''}{globalPerfAll.toFixed(2)}%
          </p>
        </div>
      </header>

      {/* Global Portfolio Summary - Trade Republic Style */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden relative">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Valeur de vos actifs</p>
            <h2 className="text-3xl font-mono font-bold text-white">{totalCurrentValueAll.toFixed(2)} €</h2>
            <p className={`text-sm font-medium mt-1 ${globalPerfAll >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {globalPerfAll >= 0 ? '+' : ''}{(totalCurrentValueAll - totalInvestedAll).toFixed(2)} € ({globalPerfAll >= 0 ? '+' : ''}{globalPerfAll.toFixed(2)}%)
            </p>
          </div>
          <div className="w-24 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <Area type="monotone" dataKey="value" stroke={globalPerfAll >= 0 ? "#10b981" : "#ef4444"} fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transfer Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
          <Download className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-white mb-1">Transférez vos comptes existants</h3>
          <p className="text-sm text-slate-300 mb-3">Regroupez vos PEA, Assurance Vie ou Compte-Titres sur Genesis pour une gestion simplifiée. Nous nous occupons des démarches.</p>
          <button className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1">
            Initier un transfert <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-lg font-bold text-white">Vos Supports</h2>
          <button 
            onClick={() => setShowExchangeSimulator(!showExchangeSimulator)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20"
          >
            <RefreshCw className={`w-3 h-3 ${showExchangeSimulator ? 'rotate-180' : ''} transition-transform`} />
            Simulateur de change
          </button>
        </div>

        <AnimatePresence>
          {showExchangeSimulator && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-4 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white">Simulateur de Taux de Change</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Montant</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">{fromCurrency}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">De</label>
                      <select 
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      >
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="pt-6">
                      <ArrowRight className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Vers</label>
                      <select 
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      >
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col justify-center">
                    <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">Résultat estimé</p>
                    <p className="text-2xl font-mono font-bold text-white">
                      {getExchangeResult().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                    </p>
                  </div>
                </div>
                
                <p className="text-[10px] text-slate-500 mt-4 italic">
                  * Taux indicatifs basés sur les cours du marché en temps réel. Des frais de change peuvent s'appliquer lors d'une transaction réelle.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {userState.investments.map((inv: any) => (
          <div 
            key={inv.id} 
            onClick={() => inv.active ? setSelectedAccount(inv.id) : null}
            className={`border rounded-3xl p-5 transition-all ${inv.active ? 'bg-slate-900/50 border-slate-800 hover:border-purple-500/50 cursor-pointer shadow-lg' : 'bg-slate-900/20 border-slate-800/50 opacity-75'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inv.active ? 'bg-purple-500/20' : 'bg-slate-800'}`}>
                  <Briefcase className={`w-5 h-5 ${inv.active ? 'text-purple-400' : 'text-slate-500'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{inv.name}</h3>
                  {inv.active ? (
                    <p className={`text-xs font-medium ${inv.performance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {inv.performance >= 0 ? '+' : ''}{inv.performance}% global
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">Non ouvert</p>
                  )}
                </div>
              </div>
              {inv.active ? (
                <ChevronRight className="w-5 h-5 text-slate-500" />
              ) : (
                <button onClick={(e) => { e.stopPropagation(); activateAccount(inv.id); }} className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                  Ouvrir
                </button>
              )}
            </div>
            
            {inv.active && (
              <p className="text-2xl font-mono font-bold text-white mt-2">{inv.balance.toFixed(2)} €</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const INSURANCE_TYPES = [
  { id: 'auto', label: 'Assurance Auto', icon: <Car /> },
  { id: 'home', label: 'Assurance Habitation', icon: <Home /> },
  { id: 'health', label: 'Mutuelle Santé', icon: <HeartPulse /> },
  { id: 'loan', label: 'Assurance Emprunteur', icon: <Landmark /> },
  { id: 'pet', label: 'Assurance Animaux', icon: <Dog /> },
];

function MajorInsurance({ userState, setUserState }: any) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [changingId, setChangingId] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAddInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !newProvider || !newPrice) return;
    
    setUserState((prev: any) => ({
      ...prev,
      userInsurances: [
        ...prev.userInsurances.filter((i: any) => i.type !== selectedType),
        {
          id: `ins_${Date.now()}`,
          type: selectedType,
          provider: newProvider,
          monthlyPrice: parseFloat(newPrice)
        }
      ]
    }));
    
    setSelectedType(null);
    setNewProvider('');
    setNewPrice('');
  };

  const handleEditInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !newProvider || !newPrice) return;

    setUserState((prev: any) => ({
      ...prev,
      userInsurances: prev.userInsurances.map((ins: any) => 
        ins.id === editingId 
          ? { ...ins, provider: newProvider, monthlyPrice: parseFloat(newPrice) }
          : ins
      )
    }));

    setEditingId(null);
    setNewProvider('');
    setNewPrice('');
  };

  const startEditing = (ins: any) => {
    setEditingId(ins.id);
    setNewProvider(ins.provider);
    setNewPrice(ins.monthlyPrice.toString());
  };

  const handleChangeProvider = (insId: string) => {
    if (changingId === insId) {
      // Final step: actually change to Genesis
      setUserState((prev: any) => ({
        ...prev,
        userInsurances: prev.userInsurances.map((ins: any) => 
          ins.id === insId 
            ? { ...ins, provider: 'Genesis Assurances', monthlyPrice: ins.monthlyPrice * 0.85 }
            : ins
        )
      }));
      setChangingId(null);
    } else {
      // First step: show "Changer pour Genesis Assurances"
      setChangingId(insId);
    }
  };

  const totalSavings = userState.userInsurances.reduce((acc: number, ins: any) => {
    if (ins.provider === 'Genesis Assurances') return acc;
    const bpcePrice = ins.monthlyPrice * 0.85; // 15% cheaper
    return acc + ((ins.monthlyPrice - bpcePrice) * 12);
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="pt-2">
        <h1 className="font-display text-2xl font-bold text-white">Mes Assurances</h1>
        <p className="text-slate-400 text-sm font-medium">Centralisez vos contrats et découvrez combien vous pourriez économiser.</p>
      </header>

      {totalSavings > 0 && (
        <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-emerald-100/70 mb-1">Économies potentielles avec BPCE</p>
              <h2 className="text-3xl font-mono font-bold text-emerald-400">+{totalSavings.toFixed(0)} € <span className="text-lg text-emerald-400/70">/ an</span></h2>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {INSURANCE_TYPES.map(type => {
          const userIns = userState.userInsurances.find((i: any) => i.type === type.id);
          const bpcePrice = userIns ? userIns.monthlyPrice * 0.85 : 0; // 15% cheaper
          const yearlySavings = userIns ? (userIns.monthlyPrice - bpcePrice) * 12 : 0;

          return (
            <div key={type.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-5 flex items-center gap-3 border-b border-slate-800/50">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  {type.icon}
                </div>
                <h3 className="font-bold text-white text-lg">{type.label}</h3>
              </div>
              
              <div className="p-5">
                {!userIns ? (
                  selectedType === type.id ? (
                    <form onSubmit={handleAddInsurance} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Assureur actuel</label>
                          <input type="text" value={newProvider} onChange={e => setNewProvider(e.target.value)} placeholder="Ex: Axa, Macif..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Mensualité (€)</label>
                          <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="0.00" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setSelectedType(null)} className="flex-1 py-2 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Annuler</button>
                        <button type="submit" disabled={!newProvider || !newPrice} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-500 disabled:opacity-50 transition-colors">Enregistrer</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setSelectedType(type.id)} className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-2xl text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Renseigner mon contrat actuel
                    </button>
                  )
                ) : (
                  <div className="space-y-4">
                    {editingId === userIns.id ? (
                      <form onSubmit={handleEditInsurance} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Assureur</label>
                            <input type="text" value={newProvider} onChange={e => setNewProvider(e.target.value)} placeholder="Ex: Axa, Macif..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Mensualité (€)</label>
                            <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="0.00" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setEditingId(null)} className="flex-1 py-2 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">Annuler</button>
                          <button type="submit" disabled={!newProvider || !newPrice} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-500 disabled:opacity-50 transition-colors">Valider</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {/* Current Insurance */}
                        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800 group relative">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Contrat Actuel</p>
                            <p className="font-bold text-white">{userIns.provider}</p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="font-mono text-lg font-bold text-slate-300">{userIns.monthlyPrice.toFixed(2)} €<span className="text-xs text-slate-500 font-sans">/mois</span></p>
                            </div>
                            <button 
                              onClick={() => startEditing(userIns)}
                              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="text-[10px]">Modifier</span>
                            </button>
                          </div>
                        </div>

                        {userIns.provider !== 'Genesis Assurances' && (
                          <>
                            <div className="flex justify-center -my-2 relative z-10">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center">
                                <ArrowRightLeft className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>

                            {/* BPCE Offer */}
                            <div className="flex justify-between items-center p-4 bg-emerald-900/20 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-xs text-emerald-400/70 uppercase tracking-wider font-bold">Proposition BPCE</p>
                                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">Mêmes garanties</span>
                                </div>
                                <p className="font-bold text-white flex items-center gap-2">
                                  <GenesisLogo className="w-4 h-4" /> Genesis Assurances
                                </p>
                              </div>
                              <div className="text-right relative z-10">
                                <p className="font-mono text-xl font-bold text-emerald-400">{bpcePrice.toFixed(2)} €<span className="text-xs text-emerald-400/70 font-sans">/mois</span></p>
                                <p className="text-xs font-bold text-emerald-400 mt-1 bg-emerald-500/20 inline-block px-2 py-0.5 rounded">-{yearlySavings.toFixed(0)}€ / an</p>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleChangeProvider(userIns.id)}
                              className={`w-full py-3 ${changingId === userIns.id ? 'bg-emerald-500' : 'bg-emerald-600'} hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg`}
                            >
                              <CheckCircle className="w-5 h-5" /> 
                              {changingId === userIns.id ? 'Changer pour Genesis Assurances' : 'Changer pour BPCE'}
                            </button>
                          </>
                        )}
                        
                        {userIns.provider === 'Genesis Assurances' && (
                          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Vous bénéficiez déjà de la meilleure offre avec Genesis.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MajorGamification({ userState, setUserState, onBack }: any) {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleCompleteChallenge = () => {
    if (userState.completedChallenges.includes(selectedChallenge.id)) {
      setSelectedChallenge(null);
      return;
    }

    setUserState((prev: any) => ({
      ...prev,
      xp: prev.xp + selectedChallenge.xpReward,
      completedChallenges: [...prev.completedChallenges, selectedChallenge.id]
    }));
    setSelectedChallenge(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
  };

  const isQuizCorrect = selectedChallenge?.quiz.every((q: any, idx: number) => quizAnswers[idx] === q.correctAnswer);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="pt-2 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Programme Avantages</h1>
          <p className="text-slate-400 text-sm font-medium">Relevez des défis et débloquez des privilèges exclusifs.</p>
        </div>
      </header>

      {/* Rewards Section */}
      <section>
        <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Vos Privilèges
        </h2>
        <div className="grid gap-3">
          {MAJOR_REWARDS.map((reward, idx) => {
            const isUnlocked = userState.xp >= reward.xpRequired;
            return (
              <div key={idx} className={`border rounded-2xl p-4 flex items-center gap-4 ${isUnlocked ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="text-3xl">{reward.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${isUnlocked ? 'text-emerald-400' : 'text-slate-300'}`}>{reward.title}</h4>
                  <p className="text-xs text-slate-500 mb-1">{reward.desc}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isUnlocked ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((userState.xp / reward.xpRequired) * 100, 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{Math.min(userState.xp, reward.xpRequired)} / {reward.xpRequired} XP</span>
                  </div>
                </div>
                {isUnlocked ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-slate-600" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Challenges Section */}
      <section>
        <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> Défis & Apprentissage
        </h2>
        <div className="grid gap-4">
          {MAJOR_CHALLENGES.map(challenge => {
            const isCompleted = userState.completedChallenges.includes(challenge.id);
            return (
              <div 
                key={challenge.id} 
                onClick={() => setSelectedChallenge(challenge)}
                className={`group border rounded-3xl p-5 transition-all cursor-pointer ${isCompleted ? 'bg-slate-900/30 border-slate-800 opacity-75' : 'bg-slate-900/80 border-slate-700 hover:border-blue-500/50 shadow-lg'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${isCompleted ? 'text-slate-400' : 'text-white'}`}>{challenge.title}</h3>
                    <p className="text-sm text-slate-500">{challenge.desc}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/10 text-blue-400'}`}>
                    {isCompleted ? 'Terminé' : `+${challenge.xpReward} XP`}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold">Q{i}</div>)}
                    </div>
                    <span className="text-xs text-slate-600 font-medium">Quiz avancé</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Challenge Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto"
          >
            <div className="max-w-2xl mx-auto p-6 space-y-8 pb-32">
              <header className="flex justify-between items-center">
                <button onClick={() => { setSelectedChallenge(null); setQuizAnswers([]); setQuizSubmitted(false); }} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
                <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
                  Défi Avancé
                </div>
              </header>

              <div className="space-y-4">
                <h2 className="text-3xl font-display font-bold text-white">{selectedChallenge.title}</h2>
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                  {selectedChallenge.content.split('\n\n').map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 space-y-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" /> Quiz de validation
                </h3>
                
                {selectedChallenge.quiz.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="space-y-4">
                    <p className="font-medium text-slate-200">{qIdx + 1}. {q.question}</p>
                    <div className="grid gap-2">
                      {q.options.map((opt: string, oIdx: number) => {
                        const isSelected = quizAnswers[qIdx] === oIdx;
                        const isCorrect = q.correctAnswer === oIdx;
                        let style = "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700";
                        
                        if (quizSubmitted) {
                          if (isCorrect) style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                          else if (isSelected) style = "bg-red-500/20 border-red-500/50 text-red-400";
                          else style = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
                        } else if (isSelected) {
                          style = "bg-blue-600 border-blue-500 text-white";
                        }

                        return (
                          <button 
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[qIdx] = oIdx;
                              setQuizAnswers(newAnswers);
                            }}
                            className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button 
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswers.length < selectedChallenge.quiz.length || quizAnswers.includes(undefined as any)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    Valider mes réponses
                  </button>
                ) : (
                  <div className="space-y-4">
                    {isQuizCorrect ? (
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-emerald-400">Félicitations !</h4>
                        <p className="text-sm text-emerald-100/70">Vous avez parfaitement compris ce module. Vous gagnez {selectedChallenge.xpReward} XP !</p>
                        <button onClick={handleCompleteChallenge} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all">
                          Récupérer ma récompense
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-3">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-red-400">Presque...</h4>
                        <p className="text-sm text-red-100/70">Certaines réponses sont incorrectes. Relisez le contenu et réessayez !</p>
                        <button onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold transition-all">
                          Réessayer le quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MajorProfile({ name, userState, setUserState, onLogout, onGoToGamification }: any) {
  const [childIdInput, setChildIdInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);

  const toggleLink = (type: 'bank' | 'insurance' | 'investment', item: string) => {
    setUserState((prev: MajorState) => {
      const key = type === 'bank' ? 'linkedBanks' : type === 'insurance' ? 'linkedInsurances' : 'linkedInvestments';
      const list = prev[key];
      if (list.includes(item)) {
        return { ...prev, [key]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [key]: [...list, item] };
      }
    });
  };

  const handleLinkChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childIdInput) return;
    setIsLinking(true);
    
    // Simulate API call and message sent to child
    setTimeout(() => {
      setIsLinking(false);
      setLinkSuccess(true);
      setUserState((prev: any) => ({
        ...prev,
        childAccount: {
          linked: true,
          id: childIdInput,
          name: "Léo",
          balance: 150.00
        }
      }));
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-3xl mx-auto space-y-8 pb-32">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Profil & Connexions</h1>
          <p className="text-slate-400 text-sm font-medium">Gérez vos informations et comptes externes.</p>
        </div>
        <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 bg-slate-900 rounded-xl">
          Déconnexion
        </button>
      </header>

      {/* Identifiant Personnel */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-widest">Votre Identifiant Genesis</p>
          <p className="font-mono text-lg text-blue-400 font-bold">{userState.accountId}</p>
        </div>
        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <History className="w-5 h-5" />
        </button>
      </section>

      {/* Gamification Entry */}
      <section>
        <div 
          onClick={onGoToGamification}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Mes avantages</h3>
              <p className="text-xs text-slate-400">Consultez vos privilèges et relevez des défis.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
        </div>
      </section>

      {/* Contrôle Parental / Compte Enfant */}
      <section className="space-y-4">
        <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" /> Contrôle Parental
        </h3>
        
        {!userState.childAccount?.linked ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
            <p className="text-sm text-slate-400">Affiliez le compte Genesis de votre enfant pour gérer ses plafonds et effectuer des virements instantanés.</p>
            <form onSubmit={handleLinkChild} className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Identifiant de l'enfant (ex: #ABC 123)" 
                  value={childIdInput}
                  onChange={(e) => setChildIdInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button 
                type="submit" 
                disabled={!childIdInput || isLinking}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLinking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Demande en cours...
                  </>
                ) : "Lier le compte enfant"}
              </button>
            </form>
            {linkSuccess && (
              <p className="text-xs text-emerald-400 text-center font-medium">Une demande d'affiliation a été envoyée à l'enfant.</p>
            )}
          </div>
        ) : (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">Compte de {userState.childAccount.name}</h4>
                <p className="text-xs text-slate-400">Affilié avec succès • {userState.childAccount.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono font-bold text-white">{userState.childAccount.balance.toFixed(2)} €</p>
              <button 
                onClick={() => setShowLimitsModal(true)}
                className="text-[10px] text-blue-400 font-bold hover:underline"
              >
                Gérer les limites
              </button>
            </div>
          </div>
        )}
      </section>

      <LimitsModal 
        isOpen={showLimitsModal} 
        onClose={() => setShowLimitsModal(false)} 
        childAccount={userState.childAccount}
        onUpdateLimits={(limits: any) => {
          setUserState((prev: any) => ({
            ...prev,
            childAccount: {
              ...prev.childAccount,
              limits
            }
          }));
          setShowLimitsModal(false);
        }}
      />

      <div className="space-y-6">
        {/* Banks */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Mes Banques</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BANKS.map(bank => {
              const isLinked = userState.linkedBanks.includes(bank);
              return (
                <div 
                  key={bank}
                  onClick={() => toggleLink('bank', bank)}
                  className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${isLinked ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}
                >
                  <span className={`text-sm font-medium ${isLinked ? 'text-blue-400' : 'text-slate-300'}`}>{bank}</span>
                  {isLinked ? <CheckCircle2 className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
                </div>
              )
            })}
          </div>
        </section>

        {/* Insurances */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Mes Assurances</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INSURANCES.map(ins => {
              const isLinked = userState.linkedInsurances.includes(ins);
              return (
                <div 
                  key={ins}
                  onClick={() => toggleLink('insurance', ins)}
                  className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${isLinked ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}
                >
                  <span className={`text-sm font-medium ${isLinked ? 'text-emerald-400' : 'text-slate-300'}`}>{ins}</span>
                  {isLinked ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
                </div>
              )
            })}
          </div>
        </section>

        {/* Investments */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Mes Investissements</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INVESTMENTS.map(inv => {
              const isLinked = userState.linkedInvestments.includes(inv);
              return (
                <div 
                  key={inv}
                  onClick={() => toggleLink('investment', inv)}
                  className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${isLinked ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}
                >
                  <span className={`text-sm font-medium ${isLinked ? 'text-purple-400' : 'text-slate-300'}`}>{inv}</span>
                  {isLinked ? <CheckCircle2 className="w-5 h-5 text-purple-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
