import React, { useEffect } from 'react';
import { Rocket, PartyPopper, Coins } from 'lucide-react';
import { fireGoalConfetti } from '../utils/confetti';
import { soundManager } from '../utils/sound';

interface RocketOverlayProps {
  sellerName: string;
  percentage: number;
  prizeAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RocketOverlay: React.FC<RocketOverlayProps> = ({
  sellerName,
  percentage,
  prizeAmount,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playRocketRumble();
      fireGoalConfetti();

      // Extended duration for majestic, clearly readable rocket launch
      const timer = setTimeout(() => {
        onClose();
      }, 5200);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-slate-950/75 backdrop-blur-md select-none">
      {/* Background Energy Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-slate-950/90 to-slate-950 flex items-center justify-center">
        <div className="w-[650px] h-[650px] bg-emerald-500/20 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* High-Impact Clear Announcement Header */}
      <div className="relative z-10 text-center space-y-3 p-6 max-w-2xl animate-in fade-in zoom-in-90 duration-300">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-amber-400/30">
          <Coins className="w-4 h-4 text-slate-950" />
          <span>FOGUETE NÃO TEM RÉ! BÔNUS CONFIRMADO! 💰</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-outfit font-black text-white tracking-tight drop-shadow-2xl">
          {sellerName} <span className="text-emerald-400">DECOLOU!</span>
        </h1>

        <p className="text-xl sm:text-3xl font-extrabold text-emerald-300 font-mono-num">
          {percentage}% DA META REALIZADA!
        </p>

        <div className="inline-block px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/40">
          💰 PRÊMIO DE R$ {prizeAmount} NO BOLSO!
        </div>
      </div>

      {/* Giant Clearly-Visible Rocket Ascending Majestically */}
      <div className="absolute bottom-0 z-20 flex flex-col items-center animate-rocket-launch">
        <div className="relative">
          {/* Main Rocket Badge */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-emerald-400 via-green-400 to-lime-300 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-400/60 border-4 border-white">
            <Rocket className="w-16 h-16 sm:w-24 sm:h-24 fill-slate-950 text-slate-950 -rotate-45" />
          </div>

          {/* Thruster Flames and Cash Particles */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-12 h-20 bg-gradient-to-b from-amber-400 via-emerald-400 to-transparent rounded-full blur-sm animate-pulse" />
            <div className="w-20 h-28 bg-gradient-to-b from-emerald-500/80 to-transparent rounded-full blur-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
