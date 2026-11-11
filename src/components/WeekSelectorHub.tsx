import React from 'react';
import { WeekNumber } from '../types';
import { WEEK_PRIZE_DEFAULTS } from '../data/initialData';
import { Trophy, Gift, Flame, Zap, Award, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface WeekSelectorHubProps {
  activeWeek: WeekNumber;
  onSelectWeek: (week: WeekNumber) => void;
  unlockedCounts: Record<WeekNumber, number>;
  totalSellers: number;
}

export const WeekSelectorHub: React.FC<WeekSelectorHubProps> = ({
  activeWeek,
  onSelectWeek,
  unlockedCounts,
  totalSellers,
}) => {
  const weeks: WeekNumber[] = [1, 2, 3, 4];

  const handleWeekClick = (w: WeekNumber) => {
    soundManager.playIncrement();
    onSelectWeek(w);
  };

  return (
    <div className="space-y-3">
      {/* Top Header Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-emerald-400 animate-bounce" />
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-outfit">
            PAINEL DE METAS & PRÊMIOS DA SEMANA
          </h2>
        </div>
        <span className="text-xs font-bold text-emerald-400/90 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
          💰 Bônus Total Acumulado: até R$ 1.000 / vendedor
        </span>
      </div>

      {/* 4 Interactive Week Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {weeks.map((w) => {
          const info = WEEK_PRIZE_DEFAULTS[w];
          const isActive = activeWeek === w;
          const unlocked = unlockedCounts[w] || 0;

          return (
            <button
              key={w}
              onClick={() => handleWeekClick(w)}
              className={`group relative overflow-hidden rounded-2xl p-4 border text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950 border-emerald-400 shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              {/* Glowing active background glow */}
              {isActive && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold tracking-wider uppercase ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {info.label}
                </span>
                {unlocked > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3 h-3 fill-slate-950 text-emerald-500" />
                    <span>{unlocked} Batidas</span>
                  </span>
                )}
              </div>

              {/* Big Prize Cash Badge */}
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xs font-bold text-slate-400">Prêmio:</span>
                <span className={`text-xl sm:text-2xl font-outfit font-black font-mono-num tracking-tight ${
                  w === 4
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-400 to-lime-300'
                    : 'text-white'
                }`}>
                  R$ {info.prize}
                </span>
              </div>

              {/* Footer status indicator */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className={isActive ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                  {isActive ? '● VISUALIZANDO PRÉVIA' : 'Clique para abrir'}
                </span>
                {w === 4 && <span className="text-amber-400 font-bold">⭐ Super Bônus</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
