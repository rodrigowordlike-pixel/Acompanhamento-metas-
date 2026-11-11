import React, { useState } from 'react';
import { Seller, WeekNumber } from '../types';
import { calculatePercentage, formatBRL, getStatusDetails } from '../data/initialData';
import { Trophy, Flame, Gift, Rocket } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { fireBurstConfetti } from '../utils/confetti';
import { SuperPartyOverlay } from './SuperPartyOverlay';

interface SellerCardProps {
  seller: Seller;
  activeWeek: WeekNumber;
  showValues: boolean;
  onOpenEditModal: (seller: Seller) => void;
  onTriggerScreenShake: () => void;
}

export const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  activeWeek,
  showValues,
  onOpenEditModal,
  onTriggerScreenShake,
}) => {
  const [isPartyActive, setIsPartyActive] = useState(false);

  const weekData = seller.weeks[activeWeek];
  const pct = calculatePercentage(weekData.current, weekData.target);
  const status = getStatusDetails(pct, weekData.prizeAmount);

  // Secret Party Click Handler for Goal Winners!
  const handleCardClick = () => {
    if (pct >= 100) {
      onTriggerScreenShake();
      setIsPartyActive(true);
    } else {
      soundManager.playNormalBeep();
      fireBurstConfetti();
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative overflow-hidden rounded-3xl bg-slate-900/95 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer select-none ${
          pct >= 100
            ? 'border-emerald-400/80 shadow-2xl shadow-emerald-500/25 ring-2 ring-emerald-400/50'
            : 'border-slate-800 hover:border-emerald-500/50'
        }`}
      >
        {/* Background neon glow */}
        <div
          className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            pct >= 100 ? 'bg-emerald-400/20' : 'bg-emerald-500/5'
          }`}
        />

        <div className="p-6 flex flex-col justify-between h-full space-y-4">
          {/* Top Header: Seller Name & Cash Prize Status */}
          <div className="flex items-center justify-between gap-2">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${seller.avatarColor || 'from-emerald-500 to-teal-700'} flex items-center justify-center text-slate-950 font-black text-xl shadow-md border border-white/20 shrink-0 group-hover:rotate-6 transition-transform`}>
                {seller.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-outfit font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>{seller.name}</span>
                  {pct >= 100 && <Rocket className="w-5 h-5 text-emerald-400 animate-bounce" />}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  Semana {activeWeek} · Prêmio R$ {weekData.prizeAmount}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wide flex items-center gap-1 ${status.color}`}>
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </span>
          </div>

          {/* Enormous % Display (Primary Focus - No raw R$ values shown) */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Progresso da Meta
              </span>
            </div>

            <div className="text-right">
              <div className="flex items-baseline justify-end gap-0.5">
                <span className={`text-4xl sm:text-5xl lg:text-6xl font-outfit font-black tracking-tight ${status.textColor} font-mono-num`}>
                  {pct}
                </span>
                <span className={`text-2xl sm:text-3xl font-black ${status.textColor}`}>
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Revealed Dollar Amounts (Only if showValues toggled by user) */}
          {showValues && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/40 flex items-center justify-between text-xs font-mono-num text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans font-medium">Vendido na Semana</span>
                <span className="font-bold text-emerald-400">{formatBRL(weekData.current)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-sans font-medium">Meta Semana {activeWeek}</span>
                <span className="font-bold text-slate-200">{formatBRL(weekData.target)}</span>
              </div>
            </div>
          )}

          {/* Glowing Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${status.progressGradient} ${
                  pct >= 100 ? 'animate-pulse' : ''
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>0%</span>
              <span>50%</span>
              <span className={pct >= 100 ? 'text-emerald-400 font-bold' : ''}>100% {pct >= 100 ? '💰' : ''}</span>
            </div>
          </div>

          {/* Custom Motivational Phrase */}
          <div className={`p-3.5 rounded-2xl border transition-colors ${status.badgeBorder}`}>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 italic flex items-start gap-2">
              <span className="text-emerald-400 text-base leading-none">“</span>
              <span>{weekData.customPhrase || status.defaultPhrase}</span>
              <span className="text-emerald-400 text-base leading-none">”</span>
            </p>
          </div>
        </div>
      </div>

      {/* Full Super Party Celebration Modal Overlay */}
      <SuperPartyOverlay
        sellerName={seller.name}
        percentage={pct}
        prizeAmount={weekData.prizeAmount}
        isOpen={isPartyActive}
        onClose={() => setIsPartyActive(false)}
      />
    </>
  );
};
