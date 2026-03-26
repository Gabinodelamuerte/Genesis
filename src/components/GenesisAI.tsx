import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User, Loader2, ChevronDown, MessageSquare, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { getFinancialAdvice, askFinancialQuestion } from '../services/geminiService';
import { GenesisLogo } from './GenesisLogo';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function GenesisAI({ userContext }: { userContext: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialAdvice, setInitialAdvice] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialAdvice();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const loadInitialAdvice = async () => {
    setIsLoading(true);
    const advice = await getFinancialAdvice(userContext);
    setMessages([{ id: '1', role: 'assistant', text: advice || "Salut ! Je suis Genesis, ton coach financier personnel. Comment puis-je t'aider à optimiser tes investissements aujourd'hui ?" }]);
    setIsLoading(false);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await askFinancialQuestion(input, userContext);
    const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: response || "Désolé, je n'ai pas pu répondre à cette question. Peux-tu reformuler ?" };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (confirm('Voulez-vous vraiment effacer toute la discussion ?')) {
      setMessages([]);
      loadInitialAdvice();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[100] w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white border border-white/20 group"
      >
        <GenesisLogo className="w-9 h-9 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-950 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-wider uppercase">
          Besoin d'aide ?
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              width: isMaximized ? 'min(95vw, 1000px)' : 'min(90vw, 400px)',
              height: isMaximized ? 'min(85vh, 800px)' : '500px',
              bottom: isMaximized ? '50%' : '10rem',
              right: isMaximized ? '50%' : '1.5rem',
              x: isMaximized ? '50%' : '0%',
              y: isMaximized ? '50%' : '0%',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-[110] bg-slate-900/90 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl`}
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-[1px] shadow-lg">
                  <div className="w-full h-full rounded-[15px] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <GenesisLogo className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg tracking-tight">Genesis AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Coach Personnel</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  title="Effacer la discussion"
                  className="p-2.5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id} 
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800 border border-slate-700' : 'bg-purple-600/20 border border-purple-500/30'}`}>
                        {msg.role === 'user' ? <User className="w-5 h-5 text-slate-400" /> : <GenesisLogo className="w-6 h-6" />}
                      </div>
                      <div className={`p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm force-white chatbot-message ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none' 
                          : 'bg-slate-800/50 text-white rounded-tl-none border border-slate-700/50 backdrop-blur-sm'
                      }`}>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-[1.8] prose-p:mb-5 last:prose-p:mb-0 prose-li:mb-2 prose-headings:mb-4 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                      <GenesisLogo className="w-6 h-6" />
                    </div>
                    <div className="p-4 rounded-[1.5rem] bg-slate-800/50 text-slate-400 rounded-tl-none border border-slate-700/50 flex items-center gap-3">
                      <div className="flex gap-1">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      </div>
                      <span className="text-xs font-medium tracking-wide">Genesis analyse tes données...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-slate-950/80 border-t border-slate-800/50 backdrop-blur-xl">
              <form onSubmit={handleSend} className="relative flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pose-moi une question sur tes finances..."
                  className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none max-h-32 custom-scrollbar"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 flex items-center justify-center force-white transition-all shadow-xl shadow-purple-500/20 shrink-0"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </form>
              <p className="mt-3 text-[10px] text-slate-600 text-center font-medium">
                Genesis peut faire des erreurs. Vérifie les informations importantes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
