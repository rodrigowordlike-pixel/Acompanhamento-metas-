import React, { useEffect } from 'react';
import { Rocket, PartyPopper, X } from 'lucide-react';
import { fireSuperPartyConfetti } from '../utils/confetti';
import { soundManager } from '../utils/sound';
import { ScratchCard } from './ScratchCard';

interface SuperPartyOverlayProps {
  sellerName: string;
  percentage: number;
  prizeAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const SuperPartyOverlay: React.FC<SuperPartyOverlayProps> = ({
  sellerName,
  percentage,
  prizeAmount,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playSuperPartyAtmosphere();
      const stopConfetti = fireSuperPartyConfetti(12000);

      const timer = setTimeout(() => {
        onClose();
      }, 35000);

      return () => {
        clearTimeout(timer);
        if (stopConfetti) stopConfetti();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-slate-950/85 backdrop-blur-lg select-none p-4 animate-in fade-in duration-300">
      {/* Background Laser & Neon Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-slate-950 to-green-950 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-emerald-500/25 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-400/20 rounded-full blur-[140px] animate-ping" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-lime-400/20 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Prominent Floating Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border-2 border-emerald-400/60 shadow-2xl transition-all hover:scale-110 pointer-events-auto cursor-pointer flex items-center gap-2"
        title="Fechar comemoração"
      >
        <span className="text-xs font-bold text-emerald-300 hidden sm:inline">Fechar</span>
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Super Party Center Stage Card */}
      <div className="relative z-10 text-center space-y-5 p-6 sm:p-8 max-w-2xl w-full rounded-3xl bg-slate-900/95 border-2 border-emerald-400/80 shadow-2xl shadow-emerald-500/40">
        {/* Top Party Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-amber-400/40 animate-bounce">
          <PartyPopper className="w-4 h-4 text-slate-950" />
          <span>FESTA DA META BATIDA! FOGUETE NÃO TEM RÉ! 🎉</span>
        </div>

        {/* Seller Champion Name */}
        <h1 className="text-4xl sm:text-6xl font-outfit font-black text-white tracking-tight drop-shadow-2xl">
          {sellerName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-lime-300">DECOLOU!</span>
        </h1>

        {/* High Percentage Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl sm:text-4xl font-black text-amber-300 font-mono-num bg-slate-950 px-6 py-2.5 rounded-2xl border border-emerald-500/40">
            {percentage}% DA META REALIZADA!
          </span>
        </div>

        {/* Interactive Scratch-Off Card for Cash Bonus & Motivational Phrase Reveal! */}
        <ScratchCard sellerName={sellerName} prizeAmount={prizeAmount} />

        <p className="text-xs text-slate-400 font-medium pt-1">
          Clique no <b>"X"</b> para retornar ao painel
        </p>
      </div>

      {/* Giant Rocket Launching from Stage */}
      <div className="absolute bottom-0 z-20 flex flex-col items-center animate-rocket-launch pointer-events-none">
        <div className="relative">
          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-lime-300 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-400/80 border-4 border-white">
            <Rocket className="w-20 h-20 sm:w-28 sm:h-28 fill-slate-950 text-slate-950 -rotate-45" />
          </div>

          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-16 h-28 bg-gradient-to-b from-amber-400 via-emerald-400 to-transparent rounded-full blur-sm animate-pulse" />
            <div className="w-24 h-36 bg-gradient-to-b from-emerald-500/80 to-transparent rounded-full blur-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
