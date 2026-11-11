import React from 'react';
import { ViewMode } from '../types';
import { LayoutDashboard, Eye, EyeOff, Volume2, VolumeX, Share2, ShieldCheck, Zap, BellRing } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showValues: boolean;
  onRequestShowValues: (show: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenWhatsApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  showValues,
  onRequestShowValues,
  soundEnabled,
  setSoundEnabled,
  onOpenWhatsApp,
}) => {
  const handleTestSound = () => {
    soundManager.playInfoprodutoSaleSound();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300/30">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <a href="/" className="font-outfit text-xl lg:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
              Meta<span className="text-emerald-400">Vendas</span>
            </a>
            <p className="text-[10px] text-emerald-400/80 font-medium tracking-wide uppercase hidden sm:block">
              Circuito 4 Semanas de Metas
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Mode Switcher (Prévia e Painel ADM - TV Mode removed) */}
        <nav className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-emerald-900/50 shadow-inner">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Prévia (%)</span>
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              viewMode === 'admin'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Painel ADM</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Test Infoproduto Sale Sound Button */}
          <button
            onClick={handleTestSound}
            title="Ouvir som de notificação de venda de infoproduto (Cha-ching! 💰)"
            className="hidden sm:flex px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Som Venda 💰</span>
          </button>

          {/* Eye Icon: Password Protected Toggle to reveal R$ values */}
          <button
            onClick={() => onRequestShowValues(!showValues)}
            title={showValues ? 'Ocultar Valores R$' : 'Revelar Valores em R$ (Requer Senha ADM)'}
            className={`p-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              showValues
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
            }`}
          >
            {showValues ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-emerald-400" />}
            <span className="hidden md:inline">{showValues ? 'R$ Visível' : 'Apenas %'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* WhatsApp Broadcast Share Button */}
          <button
            onClick={onOpenWhatsApp}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 hover:from-emerald-300 hover:to-green-400 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
